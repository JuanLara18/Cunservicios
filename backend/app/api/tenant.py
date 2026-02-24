import re

from fastapi import Header, HTTPException, status

from app.core.config import settings

TENANT_HEADER_NAME = "X-Tenant-ID"
TENANT_ID_PATTERN = re.compile(r"^[a-z0-9][a-z0-9_-]{1,63}$")


def normalize_tenant_id(raw_tenant_id: str | None) -> str:
    tenant_id = (raw_tenant_id or settings.DEFAULT_TENANT_ID).strip().lower()
    if not TENANT_ID_PATTERN.fullmatch(tenant_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Tenant inválido. Use 2-64 caracteres con letras minúsculas, "
                "números, guion (-) o guion bajo (_)."
            ),
        )
    return tenant_id


def get_tenant_id(
    x_tenant_id: str | None = Header(default=None, alias=TENANT_HEADER_NAME),
) -> str:
    return normalize_tenant_id(x_tenant_id)

