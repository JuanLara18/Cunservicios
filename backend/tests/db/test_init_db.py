from app.core.config import settings
from app.core.security import verify_password
from app.db.init_db import init_db
from app.models.cliente import Cliente
from app.models.user import User


def _configure_seed_settings(monkeypatch) -> None:
    monkeypatch.setattr(settings, "DEFAULT_TENANT_ID", "alcaldia-demo")
    monkeypatch.setattr(settings, "DEV_SEED_ADMIN_EMAIL", "admin.dev@cunservicios-demo.com")
    monkeypatch.setattr(settings, "DEV_SEED_ADMIN_PASSWORD", "DevAdmin#Portal2026!")
    monkeypatch.setattr(settings, "DEV_SEED_PORTAL_EMAIL", "portal.dev@cunservicios-demo.com")
    monkeypatch.setattr(settings, "DEV_SEED_PORTAL_PASSWORD", "DevPortal#Recibo2026!")


def test_init_db_creates_seed_users_and_sample_data(db, monkeypatch):
    _configure_seed_settings(monkeypatch)

    init_db(db)

    admin = (
        db.query(User)
        .filter(User.tenant_id == "alcaldia-demo", User.email == "admin.dev@cunservicios-demo.com")
        .first()
    )
    portal_user = (
        db.query(User)
        .filter(User.tenant_id == "alcaldia-demo", User.email == "portal.dev@cunservicios-demo.com")
        .first()
    )

    assert admin is not None
    assert admin.is_admin is True
    assert verify_password("DevAdmin#Portal2026!", admin.hashed_password)

    assert portal_user is not None
    assert portal_user.is_admin is False
    assert verify_password("DevPortal#Recibo2026!", portal_user.hashed_password)

    sample_client_count = (
        db.query(Cliente)
        .filter(Cliente.tenant_id == "alcaldia-demo")
        .count()
    )
    assert sample_client_count >= 1


def test_init_db_is_idempotent_for_seed_users(db, monkeypatch):
    _configure_seed_settings(monkeypatch)

    init_db(db)

    initial_count = (
        db.query(User)
        .filter(User.tenant_id == "alcaldia-demo")
        .count()
    )

    monkeypatch.setattr(settings, "DEV_SEED_PORTAL_PASSWORD", "Another#PortalPass2026!")
    init_db(db)

    final_count = (
        db.query(User)
        .filter(User.tenant_id == "alcaldia-demo")
        .count()
    )
    portal_user = (
        db.query(User)
        .filter(User.tenant_id == "alcaldia-demo", User.email == "portal.dev@cunservicios-demo.com")
        .first()
    )

    assert initial_count == final_count
    assert portal_user is not None
    assert verify_password("Another#PortalPass2026!", portal_user.hashed_password)
