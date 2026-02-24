export const TENANT_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{1,63}$/;

export const TENANT_VALIDATION_HINT =
  "Usa 2 a 64 caracteres: letras minúsculas, números, guion (-) o guion bajo (_).";

export const sanitizeTenantId = (value, fallback = "public") => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return normalized || fallback;
};

export const isValidTenantId = (value) => TENANT_ID_PATTERN.test(sanitizeTenantId(value));

