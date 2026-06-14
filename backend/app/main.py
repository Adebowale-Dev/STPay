from pathlib import Path

from fastapi import FastAPI
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pymongo.errors import PyMongoError

from app.config import get_settings
from app.database import db, ensure_indexes
from app.routes.admin import router as admin_router
from app.routes.airtime import router as airtime_router
from app.routes.auth import router as auth_router
from app.routes.beneficiaries import router as beneficiaries_router
from app.routes.bills import router as bills_router
from app.routes.notifications import router as notifications_router
from app.routes.transactions import router as transactions_router
from app.routes.users import router as users_router
from app.routes.wallet import router as wallet_router
from app.routes.webhooks import router as webhooks_router


settings = get_settings()
STATIC_DIR = Path(__file__).resolve().parent / "static"

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="STPay secure digital wallet and online banking backend.",
    docs_url=None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(wallet_router)
app.include_router(airtime_router)
app.include_router(bills_router)
app.include_router(transactions_router)
app.include_router(beneficiaries_router)
app.include_router(notifications_router)
app.include_router(admin_router)
app.include_router(webhooks_router)


@app.on_event("startup")
def startup() -> None:
    try:
        ensure_indexes(db)
    except PyMongoError as exc:
        raise RuntimeError(
            "MongoDB connection failed during startup. Check MONGODB_URL in backend/.env."
        ) from exc


@app.get("/")
def root() -> dict:
    return {
        "success": True,
        "message": "STPay backend is running.",
        "data": {"docs": "/docs"},
    }


@app.get("/health")
def health() -> dict:
    return {
        "success": True,
        "message": "Health check successful.",
        "data": {"status": "ok"},
    }


@app.get("/docs", include_in_schema=False)
def custom_swagger_ui():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{settings.app_name} Docs",
        swagger_favicon_url="/static/stpay-favicon.svg",
    )


@app.get("/redoc", include_in_schema=False)
def custom_redoc():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=f"{settings.app_name} ReDoc",
        redoc_favicon_url="/static/stpay-favicon.svg",
    )


@app.get("/meta.json", include_in_schema=False)
def meta() -> dict:
    return {
        "name": settings.app_name,
        "short_name": settings.app_name,
        "description": "Fast, Secure, and Simple Digital Banking",
    }


@app.get("/.well-known/appspecific/com.chrome.devtools.json", include_in_schema=False)
def chrome_devtools_probe():
    return JSONResponse({})
