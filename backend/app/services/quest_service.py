"""
Daily Quest service: date-based, idempotent, backend-driven quest lifecycle.

States:
- IN_PROGRESS (progress < target)
- COMPLETED (progress >= target, reward NOT awarded yet)
- CLAIMED (user clicked Claim; reward awarded once and recorded)
"""
from datetime import datetime, date
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.quest import DailyQuest
from app.schemas.quest import DailyQuestRead, QuestClaimResponse
from app.services.economy_service import get_or_create_activity, apply_user_delta
from app.utils.date_utils import get_today_date

DEFAULT_QUEST_DEFINITIONS = [
    {
        "type": "EARN_XP",
        "title": "Earn 30 XP Today",
        "description": "Complete lessons or practice sessions to reach 30 XP.",
        "icon": "⚡",
        "target": 30,
        "reward_gems": 40,
        "reward_xp": 0,
    },
    {
        "type": "COMPLETE_LESSONS",
        "title": "Complete 2 Lessons",
        "description": "Finish 2 language lessons today.",
        "icon": "📚",
        "target": 2,
        "reward_gems": 25,
        "reward_xp": 0,
    },
    {
        "type": "ACCURACY",
        "title": "Get 90% Accuracy",
        "description": "Maintain 90% accuracy across today's practice.",
        "icon": "🎯",
        "target": 90,
        "reward_gems": 50,
        "reward_xp": 0,
    },
]


def ensure_user_daily_quests(db: Session, user: User, day: Optional[date] = None) -> list[DailyQuest]:
    """
    Lazily provisions the user's 3 quests for `day` (defaults to today).
    Uses INSERT ... ON CONFLICT DO NOTHING so it is completely idempotent.
    """
    day = day or get_today_date()
    for q_def in DEFAULT_QUEST_DEFINITIONS:
        stmt = sqlite_insert(DailyQuest).values(
            user_id=user.id,
            quest_date=day,
            type=q_def["type"],
            title=q_def["title"],
            description=q_def["description"],
            icon=q_def.get("icon"),
            target=q_def["target"],
            current_progress=0,
            reward_xp=q_def.get("reward_xp", 0),
            reward_gems=q_def.get("reward_gems", 0),
            completed=False,
            claimed=False,
        ).on_conflict_do_nothing(index_elements=["user_id", "quest_date", "type"])
        db.execute(stmt)
    db.flush()

    return (
        db.query(DailyQuest)
        .filter(DailyQuest.user_id == user.id, DailyQuest.quest_date == day)
        .order_by(DailyQuest.id.asc())
        .all()
    )


def sync_quest_progress(db: Session, user: User, day: Optional[date] = None) -> list[DailyQuest]:
    """
    Recomputes quest progress directly from today's real UserDailyActivity counters.
    Marks completed=True if target is reached, but NEVER automatically awards the reward.
    """
    day = day or get_today_date()
    quests = ensure_user_daily_quests(db, user, day)
    activity = get_or_create_activity(db, user.id, day)

    for quest in quests:
        if quest.type == "EARN_XP":
            quest.current_progress = activity.xp_earned
        elif quest.type == "COMPLETE_LESSONS":
            quest.current_progress = activity.lessons_completed
        elif quest.type == "ACCURACY":
            if activity.total_answers > 0:
                accuracy = int(round((activity.correct_answers / activity.total_answers) * 100))
                quest.current_progress = accuracy
            else:
                quest.current_progress = 0
        elif quest.type == "PRACTICE":
            quest.current_progress = activity.practice_sessions

        if quest.current_progress >= quest.target and not quest.completed:
            quest.completed = True
            quest.completed_at = datetime.utcnow()

    db.flush()
    return quests


def get_user_quests_read(db: Session, user: User, day: Optional[date] = None) -> list[DailyQuestRead]:
    """Returns today's quests mapped to DailyQuestRead with computed state."""
    quests = sync_quest_progress(db, user, day)
    db.commit()

    result = []
    for q in quests:
        if q.claimed:
            state = "CLAIMED"
        elif q.completed or q.current_progress >= q.target:
            state = "COMPLETED"
        else:
            state = "IN_PROGRESS"

        result.append(
            DailyQuestRead(
                id=q.id,
                user_id=q.user_id,
                type=q.type,
                title=q.title,
                description=q.description,
                icon=q.icon,
                target=q.target,
                current_progress=q.current_progress,
                reward_xp=q.reward_xp,
                reward_gems=q.reward_gems,
                completed=q.completed or q.current_progress >= q.target,
                claimed=q.claimed,
                state=state,
                quest_date=q.quest_date,
                completed_at=q.completed_at,
                claimed_at=q.claimed_at,
            )
        )
    return result


def claim_quest_reward(db: Session, user: User, quest_id: int) -> QuestClaimResponse:
    """
    Claims the reward for a completed quest.
    Guarantees:
    - User ownership
    - Target achieved
    - Claimed exactly once (idempotent / duplicate rejection)
    - Updates gems / XP atomically in the same transaction
    """
    quest = db.query(DailyQuest).filter(DailyQuest.id == quest_id).first()
    if not quest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quest with id {quest_id} not found."
        )

    if quest.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to claim this quest."
        )

    # Re-sync progress against real activity
    sync_quest_progress(db, user, quest.quest_date)

    if quest.claimed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quest reward has already been claimed."
        )

    if not quest.completed and quest.current_progress < quest.target:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quest target has not been reached yet."
        )

    # Atomically mark claimed and grant reward
    quest.claimed = True
    quest.claimed_at = datetime.utcnow()
    quest.completed = True

    apply_user_delta(db, user, xp=quest.reward_xp, gems=quest.reward_gems)

    db.commit()
    db.refresh(user)

    return QuestClaimResponse(
        success=True,
        claimed=True,
        quest_id=quest.id,
        reward_gems=quest.reward_gems,
        reward_xp=quest.reward_xp,
        total_gems=user.gems,
        total_xp=user.xp,
        message=f"Claimed {quest.reward_gems} gems!",
    )
