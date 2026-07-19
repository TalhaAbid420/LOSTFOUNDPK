# LostFoundPK

A full-stack web application for reporting and reuniting lost and found items across Pakistan.

**Live:** [https://lostfoundpk.vercel.app](https://lostfoundpk.vercel.app)

## Team

| Name | Role |
|------|------|
| **Talha Abid** | Backend Development, API Design, Database, Matching Algorithm |
| **Hadeeba Javed** | Frontend Development, UI/UX Design, Team Lead |
| **Sunas Bibi** | Deployment, Testing & QA |
| **Arfa Amreen Rabia** | Presentation & Demo Video |

## Features

- **Report Lost/Found Items** — Submit detailed reports with photos, categories, cities, and dates
- **Automatic Match Detection** — Fuzzy matching (RapidFuzz) compares new reports against existing ones and suggests potential matches when a lost item is reported near a found item
- **Email Notifications** — Both parties receive email alerts via SendGrid when a potential match is found
- **Contact Reveal on Confirmation** — When a match is confirmed, users see each other's name, email, and WhatsApp number to arrange the handover
- **Image Uploads** — Photos stored on Cloudinary for fast, reliable delivery
- **JWT Authentication** — Secure signup/login with bcrypt password hashing
- **Responsive UI** — Material Design-inspired interface built with React + Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Python, FastAPI, Uvicorn |
| Database | MongoDB Atlas (Motor async driver) |
| Auth | JWT (python-jose), bcrypt |
| Image Storage | Cloudinary |
| Email | SendGrid API |
| Matching | RapidFuzz fuzzy string matching |
| Testing | Playwright (E2E) |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```
LostFound/
├── LostFoundPK-backend/       # FastAPI backend
│   ├── core/                  # Security & dependencies
│   │   ├── security.py        # Password hashing, JWT creation
│   │   └── dependencies.py    # Auth dependency (get_current_user)
│   ├── models/                # Pydantic models
│   │   ├── user.py            # UserCreate, UserResponse
│   │   ├── post.py            # PostCreate, PostResponse, enums
│   │   └── match.py           # Match model
│   ├── routers/               # API endpoints
│   │   ├── auth.py            # Signup, login, user profiles
│   │   ├── posts.py           # CRUD, fuzzy matching, email notifications
│   │   ├── matches.py         # Confirm/dismiss matches
│   │   └── upload.py          # Cloudinary image upload
│   ├── config.py              # Pydantic Settings (env vars)
│   ├── database.py            # MongoDB connection
│   ├── main.py                # FastAPI app entry point
│   ├── requirements.txt       # Python dependencies
│   └── render.yaml            # Render deployment config
├── frontend-app/              # React frontend
│   ├── src/
│   │   ├── api.js             # Auth fetch wrapper, API helpers
│   │   ├── utils/             # Safe localStorage wrappers
│   │   ├── Home.jsx           # Landing page
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Registration with phone
│   │   ├── Browse.jsx         # Browse/filter items
│   │   ├── ItemDetails.jsx    # Item detail + contact info card
│   │   ├── ReportItem.jsx     # Report lost/found items
│   │   ├── MatchReview.jsx    # Review & confirm matches
│   │   └── Dashboard.jsx      # User dashboard
│   ├── e2e/                   # Playwright E2E tests
│   ├── vercel.json            # Vercel deployment config
│   └── package.json
└── render.yaml                # Render deployment config
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (for image uploads)
- SendGrid account (for email notifications)

### Backend Setup

```bash
cd LostFoundPK-backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example and fill in your values)
cp .env.example .env

# Run the server
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd frontend-app

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Frontend will be available at `http://localhost:5173`.

### Environment Variables

**Backend (`.env`):**

| Variable | Description |
|----------|------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `MONGO_DB_NAME` | Database name (default: `lostfound`) |
| `JWT_SECRET_KEY` | Secret key for JWT signing |
| `SENDGRID_API_KEY` | SendGrid API key for emails |
| `EMAIL_FROM` | Sender email address |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

**Frontend (`.env`):**

| Variable | Description |
|----------|------------|
| `VITE_API_URL` | Backend API URL (default: `http://localhost:8000`) |

## How Matching Works

1. A user reports an item (lost or found)
2. The backend immediately searches for **opposite-type** items in the **same category and city**
3. RapidFuzz computes a similarity score on the descriptions (threshold: >40%)
4. If a match is found, a match record is created and **both users are emailed**
5. Users can review the match, see the other person's contact info, and confirm or dismiss it

## Testing

```bash
cd frontend-app

# Run E2E tests
npx playwright test
```

## Deployment

- **Frontend** — Vercel (auto-deploys from `main` branch)
- **Backend** — Render (auto-deploys from `main` branch)
- **Database** — MongoDB Atlas (free M0 cluster)

## License

Built for a university hackathon project.
