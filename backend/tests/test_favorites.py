def test_add_favorite(client, auth_headers, test_track):
    response = client.post(f"/api/favorites/{test_track.id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Adicionado aos favoritos"

def test_get_favorites(client, auth_headers, test_track):
    response = client.get("/api/favorites/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["title"] == "Música Teste"

def test_remove_favorite(client, auth_headers, test_track):
    response = client.delete(f"/api/favorites/{test_track.id}", headers=auth_headers)
    assert response.status_code == 200
	
    get_response = client.get("/api/favorites/", headers=auth_headers)
    assert len(get_response.json()) == 0
