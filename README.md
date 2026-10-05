# 🌿 Unfazed — Modern Mental Health & Therapy Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Gateway-0C2340?style=flat&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Unfazed** is a full-stack digital mental wellness and practice management platform designed to connect licensed therapists with clients. It streamlines appointment scheduling, secure communications, clinical progress documentation, session package subscriptions, automated invoicing, and integrated Razorpay payments.

---

## 🌟 Key Features

### 🩺 For Therapists
* **Practice Dashboard**: High-level overview of monthly revenue, active clients, scheduled sessions, and no-show metrics.
* **Schedule & Calendar**: Real-time appointment management with video consultation and chat room indicators.
* **Client Management**: Isolate client profiles, track attended sessions, view medical tags, and manage records.
* **Clinical Progress Notes**: Structured SOAP documentation (Subjective, Objective, Assessment, Plan), diagnostic tags, and note locking.
* **Care Packages**: Create, activate, and manage custom therapy session bundles (single, multi-session, renewal packages).
* **Financial Analytics**: Revenue breakdowns, earnings charts, and practice growth trends.

### 👤 For Clients
* **Personal Healing Dashboard**: Track upcoming sessions, active care packages, and daily emotional check-ins.
* **Therapist Matching & Booking**: Browse therapists by specialization, select consult types (Video, Chat, In-Person), and book time slots.
* **Secure Checkout**: Seamlessly purchase and renew care packages using Razorpay (UPI, Credit/Debit cards, Net Banking).
* **Billing & Invoices**: Real-time invoice generation and payment history receipts.
* **Direct Messaging**: Private, encrypted contact window between client and assigned therapist.

---

## 🏗️ Architecture & Tech Stack

```
unfazed/
├── unfazed-backend/           # Node.js & Express REST API
│   ├── src/
│   │   ├── config/            # Database (Mongoose) & Razorpay SDK setup
│   │   ├── controllers/       # Auth, Payment, and Invoice controllers
│   │   ├── middleware/        # JWT auth, role authorization, and error handling
│   │   ├── models/            # Schemas: Client, Therapist, Appointment, Note, etc.
│   │   ├── routes/            # REST API route handlers
│   │   ├── app.js             # Express configuration & CORS
│   │   └── server.js          # HTTP server bootstrap
│   ├── .env.example           # Environment template
│   └── package.json
│
└── unfazed-frontend/          # React 19 + Vite Single Page Application
    ├── public/                # Static assets & illustrations
    ├── src/
    │   ├── components/        # Reusable UI widgets (auth, therapist, client)
    │   ├── pages/             # Portal views (Dashboard, Sessions, Packages, etc.)
    │   ├── services/          # Axios HTTP clients & auth services
    │   ├── styles/            # Curated modern CSS stylesheets
    │   ├── App.jsx            # Router and role-based protected routes
    │   └── main.jsx           # App entrypoint
    ├── index.html             # HTML5 template with Razorpay Checkout SDK
    └── package.json
```

### Core Technologies
* **Frontend**: React 19, Vite, React Router v7, Axios, Lucide Icons, Custom CSS tokens
* **Backend**: Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), bcryptjs, Razorpay Node SDK
* **Database**: MongoDB (Local service or MongoDB Atlas)
* **Payments**: Razorpay Payment Gateway with server-side HMAC-SHA256 signature verification

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* **MongoDB** (Local MongoDB Server running on port 27017, or a free MongoDB Atlas URI)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Yummi266/Major_projectunlox.git
cd Major_projectunlox
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd unfazed-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```

4. Configure the environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/unfazed
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Razorpay Test Credentials (from https://dashboard.razorpay.com/#/access/api-keys)
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   * The API server will run at: `http://localhost:5000`
   * Health check endpoint: `http://localhost:5000/`

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd unfazed-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   * Open your browser and navigate to: `http://localhost:5173`

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/client/register` | Register a new client account |
| `POST` | `/api/auth/therapist/register` | Register a new therapist account |
| `POST` | `/api/auth/login` | Unified login for therapists and clients |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile |

### Appointments (`/api/appointments`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/appointments` | Get appointments for the authenticated therapist |
| `GET` | `/api/appointments/today` | Get today's scheduled appointments |
| `POST` | `/api/appointments` | Create a new appointment |
| `GET` | `/api/appointments/client-sessions` | Get session history for authenticated client |
| `POST` | `/api/appointments/book` | Client self-service appointment booking |

### Payments & Invoicing (`/api/payments` & `/api/invoices`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/payments/create-order` | Create server-side Razorpay order |
| `POST` | `/api/payments/verify` | Verify Razorpay HMAC signature & activate package |
| `GET` | `/api/payments/my-payments` | Get client payment history |
| `GET` | `/api/invoices` | List invoices for authenticated user |
| `GET` | `/api/invoices/:id` | Fetch detailed single invoice |

### Clinical Notes (`/api/notes`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/notes` | Get all clinical progress notes for therapist |
| `POST` | `/api/notes` | Create a new progress/SOAP note |
| `GET` | `/api/notes/:id` | View note details |

---

## 🔒 Security & Data Integrity
* **Password Hashing**: Industry-standard `bcryptjs` with 10 salt rounds.
* **Token Authentication**: Stateless JSON Web Tokens (JWT) with HTTP Bearer authorization headers.
* **Role-Based Isolation**: Client and therapist data partitions ensure therapists cannot see other practitioners' clients or clinical notes.
* **Cryptographic Signatures**: Razorpay payments are verified on the server using HMAC SHA-256 before any session quotas or invoices are released.

---

## 🤝 Contributing
Contributions, suggestions, and feedback are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
