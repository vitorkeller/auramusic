def test_protected_route_without_token(client):
    response = client.get("/api/profile/")
    assert response.status_code in [401, 403]

def test_protected_route_with_token(client, auth_headers):
    response = client.get("/api/profile/", headers=auth_headers)
    assert response.status_code == 200

def test_protected_route_missing_token(client):
    response = client.get("/api/tracks/")
    assert response.status_code in [401, 403]
    assert response.json()["detail"] == "Not authenticated"


def test_protected_route_invalid_token(client):
    headers = {"Authorization": "Bearer um_token_falso_qualquer_123"}
    response = client.get("/api/tracks/", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Token inválido"
