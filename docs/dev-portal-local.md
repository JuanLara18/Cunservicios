# Entorno local seguro de prueba (portal)

Guia para levantar backend y frontend en local con datos controlados de desarrollo, iniciar sesion en el portal y generar un recibo simple.

## 1) Preparar backend (FastAPI)

### 1.1 Copiar perfil local

- Windows (PowerShell):

```powershell
cd backend
Copy-Item .env.dev.portal.example .env
```

- Linux/macOS:

```bash
cd backend
cp .env.dev.portal.example .env
```

### 1.2 Definir un SECRET_KEY local unico

Genera un valor aleatorio y reemplaza `SECRET_KEY` en `backend/.env`:

```bash
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

### 1.3 Instalar dependencias y levantar API

- Windows (PowerShell):

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- Linux/macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Con este perfil:

- se crean tablas automaticamente (`AUTO_CREATE_TABLES=true`)
- se inyectan datos semilla (`ENABLE_SEED_DATA=true`)
- se habilita lockout por intentos fallidos
- se activan headers de seguridad

## 2) Preparar frontend (React)

### 2.1 Copiar perfil local

- Windows (PowerShell):

```powershell
cd ../frontend
Copy-Item .env.dev.portal.example .env
```

- Linux/macOS:

```bash
cd ../frontend
cp .env.dev.portal.example .env
```

### 2.2 Instalar y ejecutar

```bash
npm install
npm start
```

Portal: `http://localhost:3000/portal/login`

## 3) Credenciales de prueba para el portal

Tenant:

- `alcaldia-demo`

Usuario portal (no administrador):

- Email: `portal.dev@cunservicios.local`
- Password: `DevPortal#Recibo2026!`

Usuario administrador:

- Email: `admin.dev@cunservicios.local`
- Password: `DevAdmin#Portal2026!`

## 4) Generar un recibo de prueba

1. Inicia sesion en `/portal/login` con el tenant y usuario portal.
2. Ve a `Portal -> Recibos`.
3. Pulsa **Cargar plantilla base**.
4. Ajusta por ejemplo:
   - Municipio: `Alcaldia Demo`
   - Periodo: `2026-01`
   - CSEE: `1200000`
   - CINV: `450000`
   - CAOM: `380000`
   - COTR: `120000`
5. Pulsa **Generar recibo**.
6. Verifica salida en texto/markdown y prueba descarga TXT/MD.

## 5) Reiniciar entorno de prueba

Si quieres resetear datos y volver a un estado limpio:

- borra `backend/sql_app.db`
- vuelve a levantar backend con el mismo `.env`

Al arrancar, el seed recrea usuarios y datos base del tenant local.
