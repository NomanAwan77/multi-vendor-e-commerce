# Multi-Vendor E-commerce

Full-stack multi-vendor e-commerce platform with separate frontend and backend applications.

## Project Structure

- `frontend/` - React + TypeScript + Vite client app
- `backend/` - Node.js + Express + MongoDB API

## Key Features

- User authentication with role-based access (admin, vendor, user)
- Product management for vendors
- Cart and checkout workflow
- Order placement and order management
- Protected routes on both frontend and backend

## Tech Stack

- Frontend: React, TypeScript, Vite, Material UI, React Router, React Hook Form, Yup
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Cookie Parser, Multer

## Getting Started

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd Multi-Vendor-E-commerce
```

### 2) Setup backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the required variables used by the backend (database connection, auth secret, and any third-party service keys).

Start backend:

```bash
npm run dev
```

Backend runs on `http://localhost:3000`.

### 3) Setup frontend

```bash
cd ../frontend
npm install
```

Optional: create `frontend/.env` and set:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Start frontend:

```bash
npm run dev
```

## API Base Paths

- `/api/auth`
- `/api/product`
- `/api/cart`
- `/api/order`

## Security Notes

- Do not commit `.env` files.
- Keep secrets and API keys in environment variables only.
- Use `.env.example` files if you want to share required variable names safely.
