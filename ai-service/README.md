# MindGuard AI Service

FastAPI microservice for MindGuard's non-clinical mental wellness analysis, support triage, recommendations, RAG, and AI chat.

## Scope

This repository contains **only the Python AI service**. It does not include the React frontend or Node.js backend.

The service is designed as a hackathon-ready baseline and keeps model logic behind small service/model modules so individual models can be replaced later.

> **Safety:** MindGuard is not a medical device, diagnosis system, therapist, or emergency service. Support levels and wellbeing scores are non-clinical signals.

## Requirements

- Python 3.11+
- pip
- Internet access on first model download

## Setup

```bash
cd ai-service
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install:

```bash
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and configure it.

Run:

```bash
uvicorn app.main:app --reload --port 8000
```

Service:

`http://localhost:8000`

Interactive API documentation:

`http://localhost:8000/docs`

## Endpoints

### GET /api/v1/health

Response:

```json
{
  "status": "healthy",
  "service": "mindguard-ai"
}
```

### POST /api/v1/analyze/journal

Request:

```json
{
  "text": "I have been stressed about exams and sleeping less."
}
```

Returns sentiment, emotion indicators, topics, stress indicators, support triage, insights, and non-clinical recommendations.

### POST /api/v1/analyze/checkin

Request:

```json
{
  "mood": 2,
  "stressLevel": 8,
  "energyLevel": 4,
  "sleepHours": 5,
  "sleepQuality": 3,
  "focusLevel": 4,
  "journalText": "I feel overwhelmed with exams."
}
```

The wellbeing score is a transparent 0–100 non-clinical index. It combines:
- mood: 22%
- inverse stress: 22%
- energy: 15%
- sleep duration: 15%
- sleep quality: 11%
- focus: 15%

It must not be presented to users as a validated clinical score.

### POST /api/v1/analyze/trends

Request:

```json
{
  "checkins": [
    {
      "mood": 4,
      "stressLevel": 5,
      "energyLevel": 7,
      "sleepHours": 7,
      "sleepQuality": 4,
      "focusLevel": 7,
      "journalText": ""
    },
    {
      "mood": 3,
      "stressLevel": 8,
      "energyLevel": 5,
      "sleepHours": 5,
      "sleepQuality": 3,
      "focusLevel": 5,
      "journalText": ""
    }
  ]
}
```

Trend analysis uses linear slopes and explicit thresholds rather than an LLM. It can identify improving, declining, stable, sudden-change, and mixed patterns.

### POST /api/v1/chat

Request:

```json
{
  "message": "I am feeling stressed about my exams.",
  "conversation": []
}
```

Pipeline:

1. safety routing
2. RAG retrieval
3. optional LLM generation
4. grounded response
5. source return

If `AI_PROVIDER=openai`, `LLM_API_KEY`, and `LLM_MODEL` are configured, the service can use the OpenAI API. Otherwise it falls back to a local deterministic response.

## RAG

Place reviewed educational documents in:

`data/knowledge_base/`

The starter file is intentionally generic. For production/hackathon judging, replace it with a curated set of trusted resources and retain title/source metadata.

The service:
- reads `.md` and `.txt` files
- chunks documents
- creates SentenceTransformer embeddings
- persists vectors in ChromaDB
- retrieves top matching chunks
- passes retrieved context to the optional LLM

The LLM prompt explicitly instructs the model not to invent sources.

## Safety layer

Safety routing is intentionally separate from normal chat generation.

High-risk language is routed to a supportive response encouraging immediate human support, trusted people, and local emergency/crisis services. The service does not generate harmful instructions.

For a real deployment, the keyword gate should be supplemented with a validated safety classifier and human-safety review. Do not treat this hackathon implementation as a clinically validated risk predictor.

## Model abstraction

Core replaceable functions/services include:

- `SentimentModel.analyze()`
- `EmotionModel.analyze()`
- `classify_support_level()`
- `generate_recommendations()`
- `RAGService.retrieve()`
- `ChatService.respond()`

Models are instantiated during FastAPI startup rather than once per request.

## Integration from Node.js

The Node.js backend can call:

```js
const response = await fetch("http://localhost:8000/api/v1/analyze/journal", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: journalText })
});

const result = await response.json();
```

For production, place the AI service behind an internal network/API gateway and add authentication between services.

## Testing

Run:

```bash
pytest -q
```

The first test run may download transformer/sentence-transformer models.

## Production hardening checklist

Before real users:

- replace the starter knowledge base with reviewed sources
- use a validated safety model and human escalation process
- add authentication/service-to-service authorization
- add rate limiting
- encrypt sensitive data in transit and at rest
- avoid storing raw journals unless necessary
- add audit logging without exposing private journal text
- evaluate models for false positives/false negatives and demographic bias
- add model/version tracking
- add monitoring and timeout/retry handling for external LLMs
- establish a crisis-response policy for every deployment country
