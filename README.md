# 📡 RFID-Based Security System

A full-stack **RFID Access Control & Security Management System** built with:

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | **React 18** + Vite + Recharts      |
| Backend   | **Spring Boot 3.2** (Java 17)       |
| Database  | **MySQL 8.0**                        |
| Auth      | **JWT Bearer Tokens** + Spring Security RBAC |

---

## 📁 Project Structure

```
RFID/
├── frontend/               # React App (Vite)
│   └── src/
│       ├── pages/          # Dashboard, Users, Tags, Logs, Alerts, Reports, Settings
│       ├── components/     # Sidebar, UI components
│       ├── context/        # AuthContext (JWT)
│       ├── api/            # Axios API client
│       └── data/           # Mock data (demo mode)
│
└── backend/                # Spring Boot App
    └── src/main/java/com/rfid/security/
        ├── model/          # JPA Entities: User, RfidTag, AccessLog, Alert, AccessPoint
        ├── repository/     # Spring Data JPA Repositories
        ├── controller/     # REST Controllers
        ├── security/       # JWT Filter, TokenProvider
        └── config/         # SecurityConfig, AppConfig
```

---

## 🚀 Getting Started

### 1. Database Setup
```sql
-- Create database and run schema
mysql -u root -p < backend/src/main/resources/schema.sql
```

### 2. Backend (Spring Boot)
```bash
cd backend
# Edit src/main/resources/application.yml — set your DB password
# First run: set ddl-auto: create and sql.init.mode: always
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔑 Demo Login
| Username         | Password   | Role        |
|-----------------|------------|-------------|
| admin@rfid.local | admin123   | SUPER_ADMIN |
| rahul@rfid.local | admin123   | ADMIN       |
| arjun@rfid.local | admin123   | EMPLOYEE    |

> **Demo Mode**: The frontend works fully without backend using mock data.

---

## 📡 Key API Endpoints

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/api/auth/login`           | Authenticate & get JWT         |
| GET    | `/api/dashboard/stats`      | System statistics              |
| GET    | `/api/access-logs`          | Paginated access logs           |
| POST   | `/api/rfid/scan`            | RFID scan event (IoT endpoint) |
| GET    | `/api/users`                | List users (admin only)        |
| POST   | `/api/users`                | Register user                  |
| GET    | `/api/tags`                 | List RFID tags                 |
| POST   | `/api/tags`                 | Register new tag               |
| GET    | `/api/access-points`        | List access points             |
| GET    | `/api/alerts`               | List security alerts           |
| PUT    | `/api/alerts/{id}/acknowledge` | Acknowledge an alert        |

---

## 🏗️ System Architecture

```
RFID Hardware (RC522)
        ↓
  Arduino/ESP32
        ↓
POST /api/rfid/scan  ──→  Spring Boot Backend
                                  ↓
                           Authenticate Tag
                                  ↓
                        Grant / Deny Access
                                  ↓
                         Log to MySQL DB
                                  ↓
                         Alert if denied
                                  ↓
                React Dashboard (Admin Panel)
```

---

## 🔒 Security Features

- JWT-based stateless authentication
- Role-Based Access Control (RBAC): SUPER_ADMIN | ADMIN | EMPLOYEE
- BCrypt password hashing
- HTTPS-ready (configure SSL in application.yml)
- Access attempt logging + alert generation
- Tag blocking and user deactivation

---

## 📋 SRS Compliance

This implementation satisfies the SRS requirements:

| FR   | Requirement                              | Implementation                          |
|------|------------------------------------------|-----------------------------------------|
| FR1  | Read RFID tag data                       | `/api/rfid/scan` endpoint               |
| FR2  | Authenticate against stored records      | `RfidScanController.scan()`             |
| FR3  | Grant access to authorized users         | GRANTED status + log                    |
| FR4  | Deny unauthorized users                  | DENIED status + denial reason           |
| FR5  | Log all attempts with timestamp          | `AccessLog` entity persisted            |
| FR6  | Add new RFID users                       | `POST /api/users`                       |
| FR7  | Remove/deactivate users                  | `PUT /api/users/{id}/deactivate`        |
| FR8  | Trigger alert on invalid attempts        | `Alert` entity created on DENIED        |
| FR9  | Display access status on interface       | React Dashboard live feed               |
| FR10 | Store logs in database                   | MySQL `access_logs` table               |
