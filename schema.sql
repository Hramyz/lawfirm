-- Enable UUID extension (optional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CLIENTS
CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USERS / STAFF
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) CHECK (role IN ('lawyer', 'paralegal', 'admin')),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CASES
CREATE TABLE cases (
    case_id SERIAL PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    client_id INT REFERENCES clients(client_id) ON DELETE SET NULL,
    case_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending')),
    date_opened DATE DEFAULT CURRENT_DATE,
    date_closed DATE,
    description TEXT
);

-- CASE-LAWYER ASSIGNMENTS (Many-to-Many)
CREATE TABLE case_assignments (
    assignment_id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(case_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TASKS
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(case_id) ON DELETE CASCADE,
    assigned_to INT REFERENCES users(user_id) ON DELETE SET NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    due_date DATE,
    completed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOCUMENTS
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(case_id) ON DELETE CASCADE,
    uploaded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    description TEXT,
    date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- APPOINTMENTS
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(case_id) ON DELETE SET NULL,
    client_id INT REFERENCES clients(client_id) ON DELETE SET NULL,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    datetime_start TIMESTAMP NOT NULL,
    datetime_end TIMESTAMP,
    location VARCHAR(255),
    notes TEXT
);

-- INVOICES
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(case_id) ON DELETE SET NULL,
    client_id INT REFERENCES clients(client_id) ON DELETE SET NULL,
    issued_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    total_amount NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'partial'))
);

-- PAYMENTS
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    date_paid DATE,
    amount NUMERIC(10, 2),
    payment_method VARCHAR(50),
    notes TEXT
);

-- TIME TRACKING
CREATE TABLE time_entries (
    time_entry_id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(case_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    entry_date DATE,
    hours NUMERIC(5, 2),
    description TEXT
);

-- COURT HEARINGS
CREATE TABLE court_hearings (
    hearing_id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(case_id) ON DELETE CASCADE,
    hearing_date TIMESTAMP NOT NULL,
    court_name VARCHAR(255),
    court_room VARCHAR(100),
    judge_name VARCHAR(255),
    hearing_type VARCHAR(100),
    outcome TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OPPOSING COUNSEL
CREATE TABLE opposing_counsel (
    counsel_id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(case_id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    firm_name VARCHAR(255),
    email VARCHAR(150),
    phone VARCHAR(20),
    notes TEXT
);

-- CASE NOTES
CREATE TABLE case_notes (
    note_id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(case_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    note_text TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ACTIVITY LOG
CREATE TABLE activity_log (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_cases_client_id ON cases(client_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_tasks_case_id ON tasks(case_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_invoices_case_id ON invoices(case_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_court_hearings_case_id ON court_hearings(case_id);
CREATE INDEX idx_court_hearings_date ON court_hearings(hearing_date);
CREATE INDEX idx_case_notes_case_id ON case_notes(case_id);
CREATE INDEX idx_case_notes_user_id ON case_notes(user_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_table ON activity_log(table_name);
