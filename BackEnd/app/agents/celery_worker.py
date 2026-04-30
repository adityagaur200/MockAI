# from celery import Celery
# from app.config import REDIS_URL

# celery_app = Celery(
#     "worker",
#     broker=REDIS_URL,
#     backend=REDIS_URL
# )

# celery_app.conf.imports = ("app.agents.tasks",)

# celery_app.conf.task_routes = {
#     "app.agents.tasks.*": {"queue": "celery"}
# }
import os
from celery import Celery

REDIS_URL = os.environ["REDIS_URL"]  # force env, no fallback

celery_app = Celery(
    "worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    imports=("app.agents.tasks",),

    task_routes={
        "app.agents.tasks.*": {"queue": "celery"}
    },

    # ✅ important for Railway stability
    broker_connection_retry_on_startup=True,

    # ✅ serialization (avoid weird bugs)
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",

    # ✅ timezone
    timezone="UTC",
    enable_utc=True,
)