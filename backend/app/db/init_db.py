import random
import string
from datetime import datetime, timedelta

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.cliente import Cliente
from app.models.factura import ConceptoFactura, Factura
from app.models.pqr import PQR, EstadoPQR, TipoPQR
from app.models.user import User
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


def generate_radicado(tenant_id: str) -> str:
    """Genera un numero de radicado aleatorio para PQRs."""
    tenant_prefix = tenant_id[:6].upper()
    return (
        f"{tenant_prefix}-PQR-{datetime.now().strftime('%Y%m%d')}-"
        f"{''.join(random.choices(string.digits, k=5))}"
    )


def _ensure_seed_user(
    db: Session,
    *,
    tenant_id: str,
    email: str,
    password: str,
    is_admin: bool,
) -> User:
    """Crea o actualiza un usuario semilla con credenciales conocidas de desarrollo."""
    normalized_email = email.strip().lower()
    user = (
        db.query(User)
        .filter(User.tenant_id == tenant_id, User.email == normalized_email)
        .first()
    )

    hashed_password = get_password_hash(password)
    if user:
        user.hashed_password = hashed_password
        user.is_active = True
        user.is_admin = is_admin
        return user

    user = User(
        tenant_id=tenant_id,
        email=normalized_email,
        hashed_password=hashed_password,
        is_active=True,
        is_admin=is_admin,
    )
    db.add(user)
    return user


def _create_sample_business_data(db: Session, tenant_id: str) -> None:
    """Crea datos operativos minimos para pruebas del portal en local."""
    existing_clients = (
        db.query(Cliente)
        .filter(Cliente.tenant_id == tenant_id)
        .count()
    )
    if existing_clients > 0:
        print(
            "Seed de datos de negocio omitido: ya existen clientes para el tenant "
            f"{tenant_id}."
        )
        return

    print(f"Creando datos de negocio de prueba para tenant {tenant_id}...")

    # Crear clientes de ejemplo
    clientes_data = [
        {
            "nombre": "Juan Perez",
            "direccion": "Calle 123 #45-67, Chia",
            "telefono": "3001234567",
            "correo": "juan.perez@example.com",
            "numero_cuenta": "123456",
            "estrato": 3,
        },
        {
            "nombre": "Maria Lopez",
            "direccion": "Avenida 789 #12-34, Chia",
            "telefono": "3109876543",
            "correo": "maria.lopez@example.com",
            "numero_cuenta": "234567",
            "estrato": 4,
        },
        {
            "nombre": "Carlos Rodriguez",
            "direccion": "Carrera 456 #78-90, Tocancipa",
            "telefono": "3005551234",
            "correo": "carlos.rodriguez@example.com",
            "numero_cuenta": "345678",
            "estrato": 2,
        },
    ]

    for cliente_data in clientes_data:
        cliente = Cliente(**cliente_data, tenant_id=tenant_id)
        db.add(cliente)

    # Hacer flush para obtener IDs de clientes
    db.flush()

    # Obtener los clientes creados del tenant
    clientes = db.query(Cliente).filter(Cliente.tenant_id == tenant_id).all()

    # Conceptos comunes de factura
    conceptos_acueducto = [
        {"concepto": "Cargo fijo acueducto", "valor_base": 15000},
        {"concepto": "Consumo acueducto", "valor_base": 25000},
    ]

    conceptos_alcantarillado = [
        {"concepto": "Cargo fijo alcantarillado", "valor_base": 10000},
        {"concepto": "Servicio alcantarillado", "valor_base": 15000},
    ]

    # Crear facturas para cada cliente (ultimos 3 meses)
    for cliente in clientes:
        # Factor de ajuste basado en estrato (menor estrato, menor costo)
        factor_estrato = 0.8 + (cliente.estrato * 0.1)

        for month in range(1, 4):
            fecha_emision = datetime.now() - timedelta(days=30 * month)
            fecha_vencimiento = fecha_emision + timedelta(days=15)

            # Decidir estado basado en fechas
            if datetime.now() > fecha_vencimiento:
                estado = random.choice(["Pagada", "Vencida"])
            else:
                estado = "Pendiente"

            # Calcular consumo aleatorio
            consumo_m3 = random.randint(10, 30)

            # Calcular valores especificos para esta factura
            valores_conceptos = []
            valor_total = 0

            # Agregar conceptos de acueducto
            for concepto in conceptos_acueducto:
                # El consumo varia, el cargo fijo no
                multiplicador = consumo_m3 if "Consumo" in concepto["concepto"] else 1
                valor = round(concepto["valor_base"] * factor_estrato * multiplicador / 10, 2)
                valores_conceptos.append({"concepto": concepto["concepto"], "valor": valor})
                valor_total += valor

            # Agregar conceptos de alcantarillado
            for concepto in conceptos_alcantarillado:
                multiplicador = consumo_m3 if "Servicio" in concepto["concepto"] else 1
                valor = round(concepto["valor_base"] * factor_estrato * multiplicador / 10, 2)
                valores_conceptos.append({"concepto": concepto["concepto"], "valor": valor})
                valor_total += valor

            # Crear la factura
            factura = Factura(
                tenant_id=tenant_id,
                numero_factura=f"F-{fecha_emision.strftime('%Y%m')}-{cliente.numero_cuenta}",
                fecha_emision=fecha_emision.date(),
                fecha_vencimiento=fecha_vencimiento.date(),
                valor_total=round(valor_total, 2),
                estado=estado,
                cliente_id=cliente.id,
            )
            db.add(factura)
            db.flush()

            # Agregar los conceptos detallados
            for concepto_data in valores_conceptos:
                concepto = ConceptoFactura(
                    factura_id=factura.id,
                    concepto=concepto_data["concepto"],
                    valor=concepto_data["valor"],
                )
                db.add(concepto)

        # Crear PQR para algunos clientes (no todos)
        if random.random() < 0.7:
            tipo_pqr = random.choice(list(TipoPQR))

            asunto_base = {
                TipoPQR.PETICION: "Solicitud de revision de medidor",
                TipoPQR.QUEJA: "Atencion deficiente en oficina",
                TipoPQR.RECLAMO: "Facturacion excesiva",
                TipoPQR.SUGERENCIA: "Mejoras en el servicio al cliente",
                TipoPQR.DENUNCIA: "Posible fraude en conexion vecina",
            }

            descripcion_base = {
                TipoPQR.PETICION: "Solicito revision del medidor por lecturas irregulares.",
                TipoPQR.QUEJA: "La atencion recibida en oficina no fue adecuada.",
                TipoPQR.RECLAMO: "La factura actual supera el consumo habitual.",
                TipoPQR.SUGERENCIA: "Sugiero notificaciones por WhatsApp para cortes programados.",
                TipoPQR.DENUNCIA: "Observacion de posible manipulacion irregular de medidor vecino.",
            }

            pqr = PQR(
                tenant_id=tenant_id,
                tipo=tipo_pqr,
                asunto=asunto_base[tipo_pqr],
                descripcion=f"{descripcion_base[tipo_pqr]} Direccion: {cliente.direccion}.",
                fecha_creacion=datetime.now().date() - timedelta(days=random.randint(1, 30)),
                estado=random.choice(list(EstadoPQR)),
                radicado=generate_radicado(tenant_id),
                cliente_id=cliente.id,
            )

            # Si el estado es respondido o cerrado, agregar fecha de respuesta
            if pqr.estado in [EstadoPQR.RESPONDIDO, EstadoPQR.CERRADO]:
                pqr.fecha_respuesta = datetime.now().date() - timedelta(days=random.randint(0, 5))

            db.add(pqr)


def init_db(db: Session) -> None:
    """Inicializa la base de datos con usuarios y datos de prueba para desarrollo."""
    tenant_id = settings.DEFAULT_TENANT_ID
    try:
        if settings.DEV_SEED_ADMIN_EMAIL == settings.DEV_SEED_PORTAL_EMAIL:
            raise ValueError("DEV_SEED_ADMIN_EMAIL y DEV_SEED_PORTAL_EMAIL deben ser distintos")

        print(f"Inicializando/actualizando seed para tenant {tenant_id}...")

        _ensure_seed_user(
            db,
            tenant_id=tenant_id,
            email=settings.DEV_SEED_ADMIN_EMAIL,
            password=settings.DEV_SEED_ADMIN_PASSWORD or "",
            is_admin=True,
        )
        _ensure_seed_user(
            db,
            tenant_id=tenant_id,
            email=settings.DEV_SEED_PORTAL_EMAIL,
            password=settings.DEV_SEED_PORTAL_PASSWORD or "",
            is_admin=False,
        )

        db.flush()
        _create_sample_business_data(db, tenant_id=tenant_id)
        db.commit()
        print("Seed local aplicado correctamente")

    except IntegrityError as e:
        db.rollback()
        print(f"Error de integridad de datos al inicializar seed: {e}")
    except Exception as e:
        db.rollback()
        print(f"Error inesperado al inicializar seed: {e}")