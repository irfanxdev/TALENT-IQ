<img width="1919" height="829" alt="Screenshot 2025-11-23 162024" src="https://github.com/user-attachments/assets/674cff80-242c-415c-a210-8d3c0b6bc4fd" />

Talent-IQ – A Real-Time Coding Interview Platform (MERN Stack)

Talent-IQ is a real-time coding interview platform built using the MERN Stack.
This project was created to solve a common problem faced during technical interview preparation:
there is no smooth platform where learners can code, communicate, share screens, and collaborate in one place.

Talent-IQ provides a complete interview-like environment designed for seamless technical practice.

Why I Built This

During interview preparation, learners struggle with:

No platform that supports coding + video call + screen sharing together

Difficulty collaborating with co-learners

Lack of smooth chat, camera/mic controls, and screen recording

Missing integrated compiler for running DSA problems

Talent-IQ solves all of these issues using modern web technologies.

Features
Real-Time Collaboration

One-to-one coding interview room

Video calling

Camera and microphone toggle

Screen sharing

Screen recording

Real-time chat messaging

Coding Environment

Integrated code compiler using Piston API

Multiple programming language support

Real-time collaborative code sharing

Interview Experience

Clean, interview-style UI

Smooth DSA problem-solving flow

Co-learner collaboration tools

Authentication & Security

Secure authentication using Clerk

Protected routes and session handling

Backend Workflow

TanStack Query for efficient data fetching

Inngest for backend background jobs

Express.js APIs with structured architecture

Tech Stack
Frontend

React.js

Tailwind CSS

TanStack Query

Backend

Node.js

Express.js

Inngest

Database

MongoDB

APIs / External Services

Piston API (code execution)

Clerk Authentication

Installation & Setup
1. Clone the Repository
git clone https://irfan-ansari303/talent-iq.git
cd talent-iq

2. Install Dependencies
Frontend
cd frontend
npm install

Backend
cd backend
npm install

Environment Variables

Create the following .env files.

Frontend (frontend/.env)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your_stream_api_key

Backend (backend/.env)
PORT=3000
DB_URL=your_mongodb_url
NODE_ENV=development

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

CLIENT_URL=your_frontend_url

Running the Project
Start Backend
cd backend
npm run dev

Start Frontend
cd frontend
npm run dev


If you find this project helpful, consider giving the repository a star.
