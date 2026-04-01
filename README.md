# Law Firm Management System

A full-featured REST API for managing a law firm's clients, cases, staff, billing, documents, appointments, and more — built with Node.js, Express, and PostgreSQL.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express** | Web framework / routing |
| **PostgreSQL** | Relational database |
| **pg** | PostgreSQL client for Node.js |
| **dotenv** | Environment variable management |
| **nodemon** | Development auto-reload |

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [PostgreSQL](https://www.postgresql.org/) v13 or higher

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Hramyz/lawfirm.git
cd lawfirm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
PORT=3000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/lawfirm
```

### 4. Create the database and run the schema

```bash
psql -U your_user -c "CREATE DATABASE lawfirm;"
psql -U your_user -d lawfirm -f schema.sql
```

### 5. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`.

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/clients` | List all clients |
| GET | `/api/clients/:id` | Get client by ID |
| POST | `/api/clients` | Create a new client |
| PUT | `/api/clients/:id` | Update a client |
| DELETE | `/api/clients/:id` | Delete a client |
| GET | `/api/cases` | List all cases |
| GET | `/api/cases/:id` | Get case by ID |
| POST | `/api/cases` | Create a new case |
| PUT | `/api/cases/:id` | Update a case |
| DELETE | `/api/cases/:id` | Delete a case |
| GET | `/api/users` | List all users/staff |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create a new user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/documents` | List all documents |
| GET | `/api/documents/:id` | Get document by ID |
| POST | `/api/documents` | Create a new document record |
| PUT | `/api/documents/:id` | Update a document record |
| DELETE | `/api/documents/:id` | Delete a document record |
| GET | `/api/appointments` | List all appointments |
| GET | `/api/appointments/:id` | Get appointment by ID |
| POST | `/api/appointments` | Create a new appointment |
| PUT | `/api/appointments/:id` | Update an appointment |
| DELETE | `/api/appointments/:id` | Delete an appointment |
| GET | `/api/invoices` | List all invoices |
| GET | `/api/invoices/:id` | Get invoice by ID |
| POST | `/api/invoices` | Create a new invoice |
| PUT | `/api/invoices/:id` | Update an invoice |
| DELETE | `/api/invoices/:id` | Delete an invoice |
| GET | `/api/payments` | List all payments |
| GET | `/api/payments/:id` | Get payment by ID |
| POST | `/api/payments` | Create a new payment |
| PUT | `/api/payments/:id` | Update a payment |
| DELETE | `/api/payments/:id` | Delete a payment |
| GET | `/api/time-entries` | List all time entries |
| GET | `/api/time-entries/:id` | Get time entry by ID |
| POST | `/api/time-entries` | Create a new time entry |
| PUT | `/api/time-entries/:id` | Update a time entry |
| DELETE | `/api/time-entries/:id` | Delete a time entry |
| GET | `/api/court-hearings` | List all court hearings |
| GET | `/api/court-hearings/:id` | Get court hearing by ID |
| POST | `/api/court-hearings` | Create a new court hearing |
| PUT | `/api/court-hearings/:id` | Update a court hearing |
| DELETE | `/api/court-hearings/:id` | Delete a court hearing |
| GET | `/api/opposing-counsel` | List all opposing counsel |
| GET | `/api/opposing-counsel/:id` | Get opposing counsel by ID |
| POST | `/api/opposing-counsel` | Create opposing counsel record |
| PUT | `/api/opposing-counsel/:id` | Update opposing counsel record |
| DELETE | `/api/opposing-counsel/:id` | Delete opposing counsel record |
| GET | `/api/case-notes` | List all case notes |
| GET | `/api/case-notes/:id` | Get case note by ID |
| POST | `/api/case-notes` | Create a new case note |
| PUT | `/api/case-notes/:id` | Update a case note |
| DELETE | `/api/case-notes/:id` | Delete a case note |

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `clients` | Client personal and contact information |
| `users` | Firm staff: lawyers, paralegals, admins |
| `cases` | Legal cases linked to clients |
| `case_assignments` | Many-to-many: lawyers assigned to cases |
| `tasks` | Work items and to-dos per case |
| `documents` | File metadata for documents attached to cases |
| `appointments` | Scheduled meetings between staff and clients |
| `invoices` | Billing records per case/client |
| `payments` | Payment records linked to invoices |
| `time_entries` | Billable hours tracked per case/user |
| `court_hearings` | Court hearing details including judge and outcome |
| `opposing_counsel` | Opposing attorneys linked to cases |
| `case_notes` | Internal notes per case with privacy flag |
| `activity_log` | Audit trail of user actions |

---

## 🧪 Example Requests

### Create a Client

```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "phone": "555-1234",
    "address": "123 Main St, Springfield",
    "date_of_birth": "1985-06-15",
    "notes": "Referred by John Doe"
  }'
```

### Get All Clients

```bash
curl http://localhost:3000/api/clients
```

### Create a Case

```bash
curl -X POST http://localhost:3000/api/cases \
  -H "Content-Type: application/json" \
  -d '{
    "case_number": "CASE-2024-001",
    "title": "Smith v. Acme Corp",
    "client_id": 1,
    "case_type": "Civil Litigation",
    "status": "open",
    "date_opened": "2024-01-15",
    "description": "Employment dispute regarding wrongful termination"
  }'
```

### Create a Court Hearing

```bash
curl -X POST http://localhost:3000/api/court-hearings \
  -H "Content-Type: application/json" \
  -d '{
    "case_id": 1,
    "hearing_date": "2024-03-20T09:00:00",
    "court_name": "Springfield District Court",
    "court_room": "Room 4B",
    "judge_name": "Judge Patricia Williams",
    "hearing_type": "Preliminary Hearing",
    "outcome": "Continued to next date",
    "notes": "Defendant requested additional discovery time"
  }'
```

### Get All Court Hearings

```bash
curl http://localhost:3000/api/court-hearings
```
