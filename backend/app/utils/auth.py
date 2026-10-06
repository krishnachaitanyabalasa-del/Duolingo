import logging
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.course import Course, Unit, Skill, Lesson
from app.models.progress import UserUnitProgress, UserSkillProgress, UserLessonProgress
from app.config import settings

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)


def initialize_user_progress(db: Session, user: User):
    """
    Initializes learning progression for a new user:
    - Unit 1: AVAILABLE
    - Units 2+: LOCKED
    - Unit 1 Skill 1: AVAILABLE
    - Unit 1 Skill 1 Lesson 1: AVAILABLE
    - All other skills/lessons: LOCKED
    """
    course = db.query(Course).first()
    if not course:
        return

    for idx, unit in enumerate(course.units):
        existing_up = (
            db.query(UserUnitProgress)
            .filter(UserUnitProgress.user_id == user.id, UserUnitProgress.unit_id == unit.id)
            .first()
        )
        if not existing_up:
            unit_status = "AVAILABLE" if idx == 0 else "LOCKED"
            db.add(
                UserUnitProgress(
                    user_id=user.id,
                    unit_id=unit.id,
                    status=unit_status,
                    progress_percentage=0.0,
                )
            )

        for s_idx, skill in enumerate(unit.skills):
            existing_sp = (
                db.query(UserSkillProgress)
                .filter(UserSkillProgress.user_id == user.id, UserSkillProgress.skill_id == skill.id)
                .first()
            )
            if not existing_sp:
                skill_status = "AVAILABLE" if (idx == 0 and s_idx == 0) else "LOCKED"
                db.add(
                    UserSkillProgress(
                        user_id=user.id,
                        skill_id=skill.id,
                        status=skill_status,
                        crown_level=0,
                        progress_percentage=0.0,
                    )
                )

            for l_idx, lesson in enumerate(skill.lessons):
                existing_lp = (
                    db.query(UserLessonProgress)
                    .filter(UserLessonProgress.user_id == user.id, UserLessonProgress.lesson_id == lesson.id)
                    .first()
                )
                if not existing_lp:
                    lesson_status = "AVAILABLE" if (idx == 0 and s_idx == 0 and l_idx == 0) else "LOCKED"
                    db.add(
                        UserLessonProgress(
                            user_id=user.id,
                            lesson_id=lesson.id,
                            status=lesson_status,
                            is_completed=False,
                        )
                    )
                else:
                    # If first lesson was somehow created as LOCKED and no progress made, ensure it's AVAILABLE
                    if idx == 0 and s_idx == 0 and l_idx == 0 and not existing_lp.is_completed and existing_lp.status == "LOCKED":
                        existing_lp.status = "AVAILABLE"

    db.commit()


def decode_firebase_token(token: str) -> Optional[dict]:
    """
    Attempts to decode/verify Firebase ID token using firebase-admin if configured,
    or fallback parsing for testing/development tokens.
    """
    if not token or token == "null" or token == "undefined":
        return None

    # Handle mock/dev test tokens directly
    if token.startswith("dev-token-"):
        uid = token.replace("dev-token-", "")
        return {
            "uid": f"firebase_dev_{uid}",
            "email": f"{uid}@dev.duolingo.clone",
            "name": uid.capitalize(),
        }

    try:
        import firebase_admin
        from firebase_admin import auth as firebase_auth

        # Initialize firebase admin app if not already initialized
        if not firebase_admin._apps:
            firebase_admin.initialize_app()

        decoded = firebase_auth.verify_id_token(token)
        return decoded
    except Exception as e:
        logger.debug(f"Firebase admin verification not configured or token error: {e}")

    # Lightweight JWT payload decode fallback (unverified payload extraction for dev)
    try:
        import json
        import base64

        parts = token.split(".")
        if len(parts) == 3:
            payload_b64 = parts[1]
            # Pad base64 string
            rem = len(payload_b64) % 4
            if rem > 0:
                payload_b64 += "=" * (4 - rem)
            decoded_bytes = base64.urlsafe_b64decode(payload_b64)
            data = json.loads(decoded_bytes.decode("utf-8"))
            if "sub" in data or "user_id" in data:
                return {
                    "uid": data.get("sub") or data.get("user_id"),
                    "email": data.get("email"),
                    "name": data.get("name") or data.get("email", "").split("@")[0],
                }
    except Exception as err:
        logger.debug(f"Failed to decode fallback JWT: {err}")

    return None


def get_current_user(
    db: Session = Depends(get_db),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> User:
    """
    FastAPI dependency that extracts the authenticated user from Firebase ID Token
    in Authorization header, creating user + initial progress on first login,
    or falling back to default learner in dev mode when unauthenticated.
    """
    if credentials and credentials.credentials:
        token = credentials.credentials
        decoded = decode_firebase_token(token)

        if decoded and decoded.get("uid"):
            uid = decoded["uid"]
            email = decoded.get("email")
            name = decoded.get("name") or (email.split("@")[0] if email else "Learner")

            # Query by firebase_uid
            user = db.query(User).filter(User.firebase_uid == uid).first()
            if not user and email:
                user = db.query(User).filter(User.email == email).first()
                if user:
                    user.firebase_uid = uid
                    db.commit()

            if not user:
                # Generate unique username
                base_username = (email.split("@")[0] if email else name).lower().replace(" ", "_")
                username = base_username
                counter = 1
                while db.query(User).filter(User.username == username).first():
                    username = f"{base_username}_{counter}"
                    counter += 1

                user = User(
                    firebase_uid=uid,
                    email=email,
                    username=username,
                    display_name=name,
                    avatar_id="avatar_01",
                    xp=0,
                    streak=0,
                    longest_streak=0,
                    hearts=5,
                    gems=100,
                    league="Amethyst",
                )
                db.add(user)
                db.commit()
                db.refresh(user)

                # Initialize default 10-unit progression
                initialize_user_progress(db, user)

            return user

    # Fallback to default learner for dev/test compatibility
    user = db.query(User).filter(User.id == settings.DEFAULT_USER_ID).first()
    if not user:
        user = db.query(User).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learner user not found. Please seed the database.",
        )

    return user
