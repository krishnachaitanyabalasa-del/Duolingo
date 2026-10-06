from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.user import ProfileRead, ProfileUpdate, FollowerUser
from app.services.user_service import (
    get_profile_data,
    update_profile_data,
    get_followers,
    get_following,
    toggle_follow_user,
)

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=ProfileRead, summary="Get learner profile")
def read_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves full profile data for the active learner."""
    return get_profile_data(db, current_user.id)


@router.put("", response_model=ProfileRead, summary="Update learner profile")
def update_profile(dto: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Updates display name, username, bio, or cartoon avatar selection."""
    return update_profile_data(db, dto, current_user.id)


@router.get("/followers", response_model=List[FollowerUser], summary="Get user followers")
def read_followers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves list of users following the learner."""
    return get_followers(db, current_user.id)


@router.get("/following", response_model=List[FollowerUser], summary="Get users followed by learner")
def read_following(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves list of users followed by the learner."""
    return get_following(db, current_user.id)


@router.post("/follow/{user_id}", summary="Toggle follow status for a user")
def follow_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Follows or unfollows a target user."""
    return toggle_follow_user(db, user_id, current_user.id)
