from sqlalchemy import Boolean, Column, Integer, String, UniqueConstraint
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("tenant_id", "email", name="uq_users_tenant_email"),
    )

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(
        String(64),
        nullable=False,
        index=True,
        default="public",
        server_default="public",
    )
    email = Column(String, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

