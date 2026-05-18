def test_create_playlist(client, auth_headers, test_track):
    response = client.post("/api/playlists/", headers=auth_headers, json={
        "name": "Playlist de Estudo",
        "color": "from-blue-600 to-indigo-900",
        "tracks": [test_track.id]
    })
    assert response.status_code == 200
    assert "id" in response.json()

def test_get_user_playlists(client, auth_headers):
    response = client.get("/api/playlists/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["title"] == "Playlist de Estudo"
    assert data[0]["tracks"] == 1

def test_get_playlist_details(client, auth_headers):
    playlists_res = client.get("/api/playlists/", headers=auth_headers)
    playlist_id = playlists_res.json()[0]["id"]

    response = client.get(f"/api/playlists/{playlist_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Playlist de Estudo"
    assert len(data["songs"]) == 1

def test_delete_playlist(client, auth_headers):
    playlists_res = client.get("/api/playlists/", headers=auth_headers)
    playlist_id = playlists_res.json()[0]["id"]

    response = client.delete(f"/api/playlists/{playlist_id}", headers=auth_headers)
    assert response.status_code == 200
