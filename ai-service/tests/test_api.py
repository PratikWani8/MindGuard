from fastapi.testclient import TestClient
from app.main import app


def test_health():
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json()["service"] == "mindguard-ai"


def test_checkin_validation():
    with TestClient(app) as client:
        response = client.post("/api/v1/analyze/checkin", json={
            "mood": 2, "stressLevel": 8, "energyLevel": 4,
            "sleepHours": 5, "sleepQuality": 3, "focusLevel": 4,
            "journalText": "I feel stressed about exams."
        })
        assert response.status_code == 200
        data = response.json()
        assert 0 <= data["wellbeingScore"] <= 100
        assert "supportLevel" in data


def test_trends():
    with TestClient(app) as client:
        checkins = []
        for i in range(5):
            checkins.append({
                "mood": 4-i//2, "stressLevel": 4+i,
                "energyLevel": 7-i, "sleepHours": 7-i*0.5,
                "sleepQuality": 4, "focusLevel": 7-i,
                "journalText": ""
            })
        response = client.post("/api/v1/analyze/trends", json={"checkins": checkins})
        assert response.status_code == 200
        assert "stressTrend" in response.json()


def test_chat_safety():
    with TestClient(app) as client:
        response = client.post("/api/v1/chat", json={
            "message": "I want to kill myself",
            "conversation": []
        })
        assert response.status_code == 200
        assert response.json()["safetyCategory"] in {"high_risk", "immediate_danger"}
        assert "trusted person" in response.json()["answer"].lower()
