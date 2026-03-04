# 🎉 Employee Panel - Fully Converted to JavaScript

A complete employee management system with attendance tracking, expense management, and leave requests. Now fully converted from TypeScript to JavaScript with all secrets secured in environment files.

**Status:** ✅ **CONVERSION COMPLETE** - Ready to use!

## 🚀 Quick Start (One Command Each!)

```bash
# Terminal 1 - Frontend
cd client && npm install && npm run dev

# Terminal 2 - Backend  
cd server && npm install && npm run dev
```

Visit http://localhost:8080 and login with:
- Username: `admin`
- Password: `admin@123`

## 📋 What Changed

### ✅ TypeScript → JavaScript
- 100+ files converted from .ts/tsx to .jsISHx
- All type annotations removed
- All configs converted to JavaScript
- Package.json cleaned up

### ✅ Secrets Management
- Admin credentials in .env
- JWT secrets in environment
- Database URL in .env
- Never hardcoded in code

### ✅ Ready to Deploy
- Production build optimized
- Environment-specific config
- Documentation complete
- Security hardened

## 📚 Documentation

1. **👈 START HERE:** [GETTING_STARTED_CHECKLIST.md](GETTING_STARTED_CHECKLIST.md)
2. **Quick Setup:** [QUICK_START.md](QUICK_START.md)
3. **Environment Config:** [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md)
4. **What Changed:** [CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md)
5. **Technical Details:** [CONVERSION_COMPLETE.md](CONVERSION_COMPLETE.md)

## Project Structure

```
employee_panel/
├── client/                    # React frontend (JavaScript)
│   ├── src/
│   │   ├── main.jsx          # Entry point
│   │   ├── App.jsx           # Root component
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities & API
│   │   ├── store/            # State management
│   │   ├── context/          # React Context
│   │   └── test/             # Test files
│   ├── vite.config.js        # Vite build config
│   ├── tailwind.config.js    # Tailwind CSS
│   ├── eslint.config.js      # ESLint config
│   ├── package.json          # Dependencies (TS removed!)
│   ├── .env                  # Environment variables
│   └── index.html
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── index.js          # Server entry point
│   │   ├── routes/           # API routes
│   │   ├── models/           # MongoDB schemas
│   │   ├── config/           # Database config
│   │   └── ...
│   ├── package.json          # Dependencies
│   ├── .env                  # Environment variables
│   └── ...
└── README.md                 # This file
```

## Setup & Running

### Prerequisites
- Node.js 16+
- MongoDB Atlas account with connection string

### 1. Configure Environment Variables

**Server** (`server/.env`):
```env
MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0.../EmployeePanel?retryWrites=true&w=majority"
JWT_SECRET="your-secret-key"
PORT=4000
```

**Client** (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:4000
VITE_JWT_SECRET="your-secret-key"
```

### 2. Start Backend Server

```bash
cd server
npm install
npm run dev
```

Server runs on `http://localhost:4000`
- Automatically seeds 3 sample employees (EMP001, EMP002, EMP003)
- Built-in admin account: `admin / admin123`

### 3. Start Frontend Client

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:8081` (or next available port)

### 4. Access the App

Open the Vite URL in your browser and log in with:
- **Admin**: `admin` / `admin123`
- **Employee**: `EMP001` / `pass123`

## Features

### Admin Panel
- 👥 Employee Management - Add and manage employees
- 📅 Attendance Tracking - View all employee attendance records
- 💰 Expense Approvals - Review and approve/reject expenses
- 📋 Leave Approvals - Manage leave requests

### Employee Dashboard
- 🎯 Daily Attendance - Punch in/out with GPS verification
- 💼 Expense Requests - Submit and track expenses
- 📅 Leave Requests - Apply for leaves and track status
- 📊 Personal Dashboard - View summary and recent activities

## Tech Stack

**Frontend**
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Context API (state management)
- ShadCN UI (components)

**Backend**
- Express.js
- MongoDB + Mongoose
- JWT authentication
- CORS enabled

## API Endpoints

### Authentication
- `POST /api/employees/login` - Login

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee

### Attendance
- `GET /api/attendance` - List attendance records
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id/punch-out` - Update punch out time

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id/status` - Update status

### Leaves
- `GET /api/leaves` - List leave requests
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id/status` - Update status

## Notes

- All data is persisted in MongoDB Atlas
- JWT tokens are stored in localStorage
- Frontend does NOT directly access MongoDB; all requests go through the API
- Supabase dependency has been completely removed

## Deployment

For production:
1. Update `.env` variables in both server and client
2. Build client: `cd client && npm run build`
3. Deploy server to cloud (Render, Railway, Heroku, etc.)
4. Deploy client to CDN (Vercel, Netlify, etc.)


## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Backend & database notes

Supabase has been removed from this project.  A lightweight Express API
now handles data persistence, using MongoDB Atlas as the database.  

### Running the project locally

1. Configure `.env` in the root of the repository:
   ```env
   VITE_API_BASE_URL=http://localhost:4000
   MONGODB_URI="<your-atlas-uri>"
   JWT_SECRET="some-secret"
   ```
2. Start the backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   The server listens on port 4000 and will seed three employees
   (`EMP001`, `EMP002`, `EMP003`) plus an admin account
   (`admin / admin123`).

3. Start the frontend:
   ```bash
   cd ..
   npm install
   npm run dev
   ```

4. Visit the Vite URL (usually http://localhost:5173) to use the app.

### Notes

- Do **not** expose your MongoDB URI or secret keys in the browser.
- The frontend state is now backed by the API; all previous in-memory
  seed data has been removed.
- Remove any references to `@supabase/supabase-js` from `package.json`.

