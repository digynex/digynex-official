-- =========================================================================
-- DigyNex Enterprise BI Dashboard - Supabase Base Schema & Mock Data
-- =========================================================================

-- 1. Create the Transactions Table
CREATE TABLE IF NOT EXISTS bi_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transaction_date DATE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('revenue', 'expense')),
    category VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE bi_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view all data (for Dashboard)
CREATE POLICY "Allow authenticated users to read transactions" 
    ON bi_transactions 
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- 2. Create the KPI Metrics Target Table
CREATE TABLE IF NOT EXISTS kpi_targets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    month DATE NOT NULL, -- e.g. 2026-03-01
    target_revenue DECIMAL(12, 2) NOT NULL,
    target_profit DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE kpi_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read targets" 
    ON kpi_targets 
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- =========================================================================
-- 3. INSERT FAKE INITIAL DATA (Seed for the Dashboard)
-- =========================================================================

-- Insert some Revenue (Course Fees, Enterprise SaaS Subscriptions)
INSERT INTO bi_transactions (transaction_date, amount, type, category, description) VALUES
('2026-03-01', 150000.00, 'revenue', 'course_fee', 'Advanced Batch A - Full Payments'),
('2026-03-02', 200000.00, 'revenue', 'saas_subscription', 'Enterprise Client XYZ - Monthly Renewal'),
('2026-03-05', 85000.00,  'revenue', 'course_fee', 'Beginner Batch B - Installments'),
('2026-03-10', 320000.00, 'revenue', 'saas_subscription', 'Corporate Partner ABC - Yearly License'),
('2026-03-15', 120000.00, 'revenue', 'course_fee', 'Advanced Batch A - Late Payments'),
('2026-03-18', 450000.00, 'revenue', 'consulting', 'AI Implementation Consulting Project'),
('2026-03-24', 90000.00,  'revenue', 'course_fee', 'Weekend Workshop Registration');

-- Insert some Expenses (Salaries, Marketing, Servers)
INSERT INTO bi_transactions (transaction_date, amount, type, category, description) VALUES
('2026-03-01', 50000.00, 'expense', 'server_cost', 'AWS / Supabase Cloud Hosting Bill'),
('2026-03-04', 120000.00, 'expense', 'marketing', 'Facebook Nexus Ad Campaign'),
('2026-03-10', 600000.00, 'expense', 'salary', 'Monthly Staff & Instructor Salaries'),
('2026-03-15', 30000.00, 'expense', 'software', 'Internal SaaS Tools & API Limits'),
('2026-03-20', 80000.00, 'expense', 'marketing', 'LinkedIn B2B Lead Gen Campaign');

-- Insert Target KPIs for March 2026
INSERT INTO kpi_targets (month, target_revenue, target_profit) VALUES
('2026-03-01', 1500000.00, 500000.00);

-- =========================================================================
-- 4. STRATEGIC WORKFLOW TABLES (Phase 8)
-- =========================================================================

-- Create the Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    po_number VARCHAR(100) NOT NULL UNIQUE,
    client_name VARCHAR(200) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    budget_limit DECIMAL(15, 2),
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'converted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read POs" ON purchase_orders FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert POs" ON purchase_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update POs" ON purchase_orders FOR UPDATE USING (true);

-- Create the Work Orders Table
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    po_id UUID REFERENCES purchase_orders(id),
    name VARCHAR(200) NOT NULL,
    assigned_supervisor VARCHAR(100), -- Team Lead / Admin
    assigned_subcontractor VARCHAR(100), -- Subcontractor Name / Profile
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    deadline DATE,
    budget_allocation DECIMAL(15, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read WOs" ON work_orders FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert WOs" ON work_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update WOs" ON work_orders FOR UPDATE USING (true);

-- Create the Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wo_id UUID REFERENCES work_orders(id),
    client_name VARCHAR(200) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert invoices" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update invoices" ON invoices FOR UPDATE USING (true);

-- =========================================================================
-- 5. SEED DATA FOR STRATEGIC FLOW (PO -> WO)
-- =========================================================================

INSERT INTO purchase_orders (po_number, client_name, amount, budget_limit, description, status) VALUES
('PO-2026-001', 'Axis Corporate Ltd', 850000.00, 900000.00, 'Cloud Infrastructure Migration Q1', 'approved'),
('PO-2026-002', 'Nexus Digital', 120000.00, 150000.00, 'AI Content Engine Integration', 'pending');

INSERT INTO work_orders (po_id, name, assigned_supervisor, assigned_subcontractor, status, budget_allocation) VALUES
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2026-001'), 'Infra Sharding Execution', 'Amila Supervisor', 'TechNode Solutions', 'in_progress', 400000.00);
