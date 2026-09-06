<pre>
███╗   ███╗██╗███╗   ██╗██████╗  ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗
████╗ ████║██║████╗  ██║██╔══██╗██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
██╔████╔██║██║██╔██╗ ██║██║  ██║██║  ███╗██║   ██║███████║██████╔╝██║  ██║
██║╚██╔╝██║██║██║╚██╗██║██║  ██║██║   ██║╚██╗ ██╔╝██╔══██║██╔══██╗██║  ██║
██║ ╚═╝ ██║██║██║ ╚████║██████╔╝╚██████╔╝ ╚████╔╝ ██║  ██║██║  ██║██████╔╝
╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝
</pre>

**MindGuard** is an AI-powered mental health wellbeing platform designed to help users track their wellbeing, receive AI-generated insights, assess risks, and access personalized support.

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

## Running the Complete Project

Run the three services separately:

```text
Frontend      → http://localhost:5173
Backend       → http://localhost:5000
AI Service    → http://localhost:8000
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
