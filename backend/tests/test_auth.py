def test_register(client):
    response = client.post("/api/auth/register", json={
        "username": "novousuario",
        "password": "senha_forte_123"
    })

    assert response.status_code == 200
    assert response.json()["username"] == "novousuario"

def test_login(client):
    response = client.post("/api/auth/login", json={
        "username": "novousuario",
        "password": "senha_forte_123"
    })

    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["username"] == "novousuario"

def test_login_invalid_credentials(client):
    response = client.post("/api/auth/login", json={
        "username": "novousuario",
        "password": "senha_errada"
    })
    assert response.status_code == 400
