def test_get_profile(client, auth_headers):
    response = client.get("/api/profile/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "display_name" in data
    assert "playlist_count" in data

def test_update_profile(client, auth_headers):
    update_response = client.put("/api/profile/", headers=auth_headers, json={
        "display_name": "Usuário Teste",
        "bio": "AuraMusic"
    })
    assert update_response.status_code == 200

    get_response = client.get("/api/profile/", headers=auth_headers)
    data = get_response.json()
    assert data["display_name"] == "Usuário Teste"
    assert data["bio"] == "AuraMusic"
