from fastapi import status


def build_payload():
    return {
        "municipio": "Alcaldía de Prueba",
        "periodo": "2026-01",
        "anno_aplicacion": 2026,
        "tasa_retorno": 0.1,
        "energia_niveles": [
            {
                "nivel_tension": 1,
                "tee": 100,
                "cee_medido_kwh": 10,
                "aforos": [
                    {
                        "clase_iluminacion": 1,
                        "carga_kw": 1,
                        "horas_diarias": 2,
                        "dias_facturacion": 3,
                    }
                ],
            },
            {
                "nivel_tension": 2,
                "tee": 200,
                "cee_medido_kwh": 5,
                "aforos": [],
            },
        ],
        "inversion_niveles": [
            {
                "nivel_tension": 1,
                "ucap": [
                    {
                        "cr_i": 1000,
                        "cr_l_base": 130,
                        "eficacia_lm_w": 130,
                        "vida_util_anios": 1,
                    }
                ],
                "terrenos": [{"area_m2": 10, "valor_catastral_m2": 100}],
            },
            {
                "nivel_tension": 2,
                "ucap": [
                    {
                        "cr_i": 500,
                        "cr_l_base": 0,
                        "vida_util_anios": 1,
                    }
                ],
                "terrenos": [],
            },
        ],
        "disponibilidad": {
            "potencia_total_kw": 10,
            "horas_periodo": 100,
            "eventos": [{"potencia_kw": 1, "horas_sin_servicio": 10}],
        },
        "aom_niveles": [
            {
                "nivel_tension": 1,
                "cra_n": 700,
                "cral_n": 300,
                "vceei_eventos": [{"potencia_kw": 0.1, "horas_indisponibilidad": 1}],
            },
            {"nivel_tension": 2, "cra_n": 300, "cral_n": 200, "vceei_eventos": []},
        ],
        "cotr": {
            "interventoria": 20,
            "costos_ambientales": 5,
            "polizas": 10,
            "tramites_impuestos": 5,
            "otros": 0,
        },
    }


def test_get_alumbrado_parameters(client, admin_token_headers):
    response = client.get("/api/alumbrado/parametros?anno=2026", headers=admin_token_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["metodologia"] == "CREG 101 013 de 2022"
    assert data["faoml"] == 0.074


def test_calculate_alumbrado(client, admin_token_headers):
    response = client.post("/api/alumbrado/calcular", json=build_payload(), headers=admin_token_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["metodologia"] == "CREG 101 013 de 2022"
    assert data["municipio"] == "Alcaldía de Prueba"
    assert data["cap"] > 0
    assert "recibo" in data
    assert len(data["energia_niveles"]) == 2


def test_calculate_alumbrado_environmental_limit(client, admin_token_headers):
    payload = build_payload()
    payload["cotr"]["costos_ambientales"] = 20
    response = client.post("/api/alumbrado/calcular", json=payload, headers=admin_token_headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "costos ambientales" in response.json()["detail"]


def test_get_receipt_template(client, admin_token_headers):
    response = client.get("/api/alumbrado/recibo/plantilla", headers=admin_token_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "componentes" in data
    assert "metadata" in data


def test_create_simple_receipt_from_template(client, admin_token_headers):
    payload = {
        "municipio": "Alcaldía de Prueba",
        "periodo": "2026-01",
        "metodologia": "CREG 101 013 de 2022",
        "componentes": {
            "csee": 1000,
            "cinv": 2000,
            "caom": 3000,
            "cotr": 400,
        },
        "metadata": {
            "entidad_facturadora": "Cunservicios",
            "fuente_datos": "plantilla_manual_v1",
        },
    }
    response = client.post(
        "/api/alumbrado/recibo/simple/desde-plantilla",
        json=payload,
        headers=admin_token_headers,
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["metodologia"] == "CREG 101 013 de 2022"
    assert data["total"] == 6400
    assert "contenido_texto" in data
    assert "contenido_markdown" in data


def test_create_simple_receipt_from_calculation(client, admin_token_headers):
    payload = {
        "calculo": build_payload(),
        "metadata": {
            "entidad_facturadora": "Cunservicios",
            "fuente_datos": "normalizacion_pdf_v1",
        },
    }
    response = client.post(
        "/api/alumbrado/recibo/simple/desde-calculo",
        json=payload,
        headers=admin_token_headers,
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["municipio"] == "Alcaldía de Prueba"
    assert data["total"] > 0
    assert data["fuente_datos"] == "normalizacion_pdf_v1"

