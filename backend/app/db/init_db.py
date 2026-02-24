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


def generate_radicado(tenant_id: str):
    """Genera un número de radicado aleatorio para PQRs"""
    tenant_prefix = tenant_id[:6].upper()
    return (
        f"{tenant_prefix}-PQR-{datetime.now().strftime('%Y%m%d')}-"
        f"{''.join(random.choices(string.digits, k=5))}"
    )


def init_db(db: Session) -> None:
    """Inicializa la base de datos con datos de prueba"""
    tenant_id = settings.DEFAULT_TENANT_ID
    try:
        # Verificar si ya hay datos para evitar duplicados
        if db.query(User).count() > 0:
            print("La base de datos ya está inicializada, saltando la fase de inicialización")
            return
            
        print("Inicializando la base de datos con datos de prueba...")
        
        # Crear usuario administrador
        admin = User(
            tenant_id=tenant_id,
            email="admin@cunservicios.com",
            hashed_password=get_password_hash("adminpass"),
            is_active=True,
            is_admin=True,
        )
        db.add(admin)
        
        # Crear algunos usuarios normales
        for i in range(1, 4):
            user = User(
                tenant_id=tenant_id,
                email=f"usuario{i}@example.com",
                hashed_password=get_password_hash(f"password{i}"),
                is_active=True,
                is_admin=False,
            )
            db.add(user)
        
        # Hacer un commit parcial para obtener IDs
        db.flush()
        
        # Crear clientes de ejemplo
        clientes_data = [
            {
                "nombre": "Juan Pérez",
                "direccion": "Calle 123 #45-67, Chía",
                "telefono": "3001234567",
                "correo": "juan.perez@example.com",
                "numero_cuenta": "123456",
                "estrato": 3
            },
            {
                "nombre": "María López",
                "direccion": "Avenida 789 #12-34, Chía",
                "telefono": "3109876543",
                "correo": "maria.lopez@example.com",
                "numero_cuenta": "234567",
                "estrato": 4
            },
            {
                "nombre": "Carlos Rodríguez",
                "direccion": "Carrera 456 #78-90, Tocancipá",
                "telefono": "3005551234",
                "correo": "carlos.rodriguez@example.com",
                "numero_cuenta": "345678",
                "estrato": 2
            }
        ]
        
        for cliente_data in clientes_data:
            cliente = Cliente(**cliente_data, tenant_id=tenant_id)
            db.add(cliente)
            
        # Hacer otro commit parcial para obtener IDs de clientes
        db.flush()
        
        # Obtener los clientes creados
        clientes = db.query(Cliente).all()
        
        # Conceptos comunes de factura
        conceptos_acueducto = [
            {"concepto": "Cargo fijo acueducto", "valor_base": 15000},
            {"concepto": "Consumo acueducto", "valor_base": 25000},
        ]
        
        conceptos_alcantarillado = [
            {"concepto": "Cargo fijo alcantarillado", "valor_base": 10000},
            {"concepto": "Servicio alcantarillado", "valor_base": 15000},
        ]
        
        # Crear facturas para cada cliente (últimos 3 meses)
        for cliente in clientes:
            # Factor de ajuste basado en estrato (menor estrato, menor costo)
            factor_estrato = 0.8 + (cliente.estrato * 0.1)  # Estrato 1: 0.9, Estrato 6: 1.4
            
            for month in range(1, 4):  # Últimos 3 meses
                fecha_emision = datetime.now() - timedelta(days=30*month)
                fecha_vencimiento = fecha_emision + timedelta(days=15)
                
                # Decidir estado basado en fechas
                if datetime.now() > fecha_vencimiento:
                    estado = random.choice(["Pagada", "Vencida"])
                else:
                    estado = "Pendiente"
                
                # Calcular consumo aleatorio
                consumo_m3 = random.randint(10, 30)
                
                # Calcular valores específicos para esta factura
                valores_conceptos = []
                valor_total = 0
                
                # Agregar conceptos de acueducto
                for concepto in conceptos_acueducto:
                    # El consumo varía, el cargo fijo no
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
                    cliente_id=cliente.id
                )
                db.add(factura)
                db.flush()  # Para obtener ID de factura
                
                # Agregar los conceptos detallados
                for concepto_data in valores_conceptos:
                    concepto = ConceptoFactura(
                        factura_id=factura.id,
                        concepto=concepto_data["concepto"],
                        valor=concepto_data["valor"]
                    )
                    db.add(concepto)
            
            # Crear PQRs para algunos clientes (no todos)
            if random.random() < 0.7:  # 70% de probabilidad de tener PQR
                tipo_pqr = random.choice(list(TipoPQR))
                
                # Definir asunto según tipo de PQR
                asunto_base = {
                    TipoPQR.PETICION: "Solicitud de revisión de medidor",
                    TipoPQR.QUEJA: "Atención deficiente en oficina",
                    TipoPQR.RECLAMO: "Facturación excesiva",
                    TipoPQR.SUGERENCIA: "Mejoras en el servicio al cliente",
                    TipoPQR.DENUNCIA: "Posible fraude en conexión vecina"
                }
                
                # Descripción según tipo de PQR
                descripcion_base = {
                    TipoPQR.PETICION: "Solicito amablemente una revisión del medidor de mi domicilio ya que presenta lecturas irregulares.",
                    TipoPQR.QUEJA: "Estuve en la oficina principal el día 10 de marzo y la atención recibida fue deficiente.",
                    TipoPQR.RECLAMO: "La factura del mes actual presenta un cobro excesivo en comparación con mi consumo habitual.",
                    TipoPQR.SUGERENCIA: "Sugiero implementar un sistema de notificaciones por WhatsApp para los cortes programados.",
                    TipoPQR.DENUNCIA: "He observado manipulación irregular del medidor en la dirección vecina."
                }
                
                # Crear la PQR
                pqr = PQR(
                    tenant_id=tenant_id,
                    tipo=tipo_pqr,
                    asunto=asunto_base[tipo_pqr],
                    descripcion=f"{descripcion_base[tipo_pqr]} Dirección: {cliente.direccion}.",
                    fecha_creacion=datetime.now().date() - timedelta(days=random.randint(1, 30)),
                    estado=random.choice(list(EstadoPQR)),
                    radicado=generate_radicado(tenant_id),
                    cliente_id=cliente.id
                )
                
                # Si el estado es respondido o cerrado, agregar fecha de respuesta
                if pqr.estado in [EstadoPQR.RESPONDIDO, EstadoPQR.CERRADO]:
                    pqr.fecha_respuesta = datetime.now().date() - timedelta(days=random.randint(0, 5))
                
                db.add(pqr)
        
        db.commit()
        print("Base de datos inicializada correctamente con datos de prueba")
        
    except IntegrityError as e:
        db.rollback()
        print(f"Error de integridad de datos al inicializar la base de datos: {e}")
    except Exception as e:
        db.rollback()
        print(f"Error inesperado al inicializar la base de datos: {e}")