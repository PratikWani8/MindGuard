# MindGuard

<pre>
███╗   ███╗██╗███╗   ██╗██████╗  ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗
████╗ ████║██║████╗  ██║██╔══██╗██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
██╔████╔██║██║██╔██╗ ██║██║  ██║██║  ███╗██║   ██║███████║██████╔╝██║  ██║
██║╚██╔╝██║██║██║╚██╗██║██║  ██║██║   ██║╚██╗ ██╔╝██╔══██║██╔══██╗██║  ██║
██║ ╚═╝ ██║██║██║ ╚████║██████╔╝╚██████╔╝ ╚████╔╝ ██║  ██║██║  ██║██████╔╝
╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝
</pre>

**MindGuard** is an AI-powered mental wellbeing platform designed to help users track their wellbeing, receive AI-generated insights, assess risks, and access personalized support.

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* Framer Motion
* Recharts

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* REST APIs

### AI Service

* Python
* FastAPI
* Groq / LLM
* Pydantic

## Project Structure

```text
MindGuard/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── ai-service/             # Python AI microservice
└── README.md
```

## Main Features

* User authentication
* Mental wellbeing check-ins
* Wellbeing trends
* AI-powered insights
* Risk assessment
* Personalized recommendations
* Dashboard and analytics
* Secure REST APIs
* Separate AI microservice
* Responsive UI

## Architecture

```text
                 ┌───────────────┐
                 │ React Client  │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ Node / Express│
                 │    Backend    │
                 └───────┬───────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
       ┌─────────────┐      ┌─────────────┐
       │   MongoDB   │      │ AI Service  │
       │  Database   │      │   FastAPI   │
       └─────────────┘      └──────┬──────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │ Groq / LLM  │
                            └─────────────┘
```

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd MindGuard
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

### 3. Backend

```bash
cd server
npm install
npm run dev
```

### 4. AI Service

```bash
cd ai-service
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run:

```bash
uvicorn app.main:app --reload --port 8000
```

## Running the Complete Project

Run the three services separately:

```text
Frontend      → http://localhost:5173
Backend       → http://localhost:5000
AI Service    → http://localhost:8000
```

## API Documentation

Once the AI service is running:

```text
http://localhost:8000/docs
```

## Development

```text
Frontend → User Interface
Backend  → Authentication, APIs & database
AI       → AI analysis & insights
MongoDB  → Application data
```

---
## ⭐ Support
If you found this project helpful, consider giving it a star ⭐ on GitHub!
