from app.routers.course import router as course_router
from app.routers.user import router as user_router
from app.routers.progress import router as progress_router
from app.routers.lesson import router as lesson_router
from app.routers.gamification import router as gamification_router
from app.routers.achievement import router as achievement_router

__all__ = [
    "course_router",
    "user_router",
    "progress_router",
    "lesson_router",
    "gamification_router",
    "achievement_router",
]
