# PostgreSQL Database Guide for MoX Association Website

Complete guide for setting up, managing, and working with PostgreSQL for the MoX Association website.

---

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Database Creation](#database-creation)
3. [Schema Setup](#schema-setup)
4. [CRUD Operations](#crud-operations)
5. [Data Management](#data-management)
6. [Queries & Reports](#queries--reports)
7. [Backup & Recovery](#backup--recovery)
8. [Maintenance & Optimization](#maintenance--optimization)
9. [Connection Setup](#connection-setup)
10. [Troubleshooting](#troubleshooting)

---

## Installation & Setup

### Windows Installation

1. **Download PostgreSQL**
   - Go to [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
   - Download PostgreSQL 14 or later

2. **Run Installer**
   - Execute the downloaded .exe file
   - Follow the installation wizard
   - Set a strong password for the `postgres` superuser (remember this!)
   - Default port is 5432 (use this unless you have conflicts)

3. **Verify Installation**
   ```bash
   # Test PostgreSQL installation
   psql --version
   ```

### macOS Installation

```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Verify installation
psql --version
```

### Linux Installation (Ubuntu/Debian)

```bash
# Update package manager
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql

# Verify installation
psql --version
```

---

## Database Creation

### Method 1: Using psql Command Line

1. **Connect to PostgreSQL**
   ```bash
   # Windows
   psql -U postgres
   
   # macOS/Linux
   sudo -u postgres psql
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE mox_db;
   ```

3. **Switch to Database**
   ```sql
   \c mox_db
   ```

4. **Verify Connection**
   ```sql
   \l  -- Lists all databases
   \d  -- Shows tables in current database
   ```

### Method 2: Using GUI Tools

**pgAdmin (Recommended)**
- Download: [pgadmin.org](https://www.pgadmin.org/)
- Right-click "Databases" → Create → Database
- Name: `mox_db`
- Click Save

**Alternative Tools:**
- DBeaver: [dbeaver.io](https://dbeaver.io/)
- DataGrip: [jetbrains.com/datagrip](https://www.jetbrains.com/datagrip/)

---

## Schema Setup

### Option 1: Run Full Schema File

```bash
# Connect and import schema
psql -U postgres -d mox_db -f sql/schema.sql
```

### Option 2: Manual Setup

```sql
-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create tables (see FULL SCHEMA below)
-- Copy all CREATE TABLE statements

-- 3. Add indexes
-- Copy all CREATE INDEX statements

-- 4. Add triggers
-- Copy all CREATE TRIGGER statements

-- 5. Verify
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Full Schema (Copy & Paste)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CONTACT SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
ON contact_submissions(email);

-- =====================================================
-- MEMBERSHIP APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS membership_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  membership_type TEXT NOT NULL 
    CHECK (membership_type IN ('individual', 'student', 'corporate')),
  payment_status TEXT DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_membership_created_at 
ON membership_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_membership_email 
ON membership_applications(email);
CREATE INDEX IF NOT EXISTS idx_membership_type 
ON membership_applications(membership_type);
CREATE INDEX IF NOT EXISTS idx_membership_status 
ON membership_applications(payment_status);

-- =====================================================
-- EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL 
    CHECK (category IN ('Conference', 'Workshop', 'Networking', 'Social', 'Training', 'Seminar')),
  status TEXT NOT NULL 
    CHECK (status IN ('upcoming', 'past')),
  price DECIMAL(10,2) DEFAULT 0 CHECK (price >= 0),
  max_attendees INTEGER DEFAULT 100 CHECK (max_attendees > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date 
ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_status 
ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category 
ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status_date 
ON events(status, date);

-- =====================================================
-- COMMITTEE MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS committee_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_committee_order 
ON committee_members("order");

-- =====================================================
-- UPDATE TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at 
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_committee_updated_at 
BEFORE UPDATE ON committee_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## CRUD Operations

### CREATE (Insert Data)

#### Add Single Event
```sql
INSERT INTO events 
(title, description, date, time, location, image_url, category, status, price, max_attendees)
VALUES (
  'Annual Conference 2026',
  'Major conference bringing together industry professionals',
  '2026-06-15',
  '09:00',
  'Convention Center, Brussels',
  'https://example.com/image.jpg',
  'Conference',
  'upcoming',
  200.00,
  500
);
```

#### Add Multiple Events
```sql
INSERT INTO events 
(title, description, date, time, location, category, status, price, max_attendees)
VALUES
  ('Workshop 1', 'Description 1', '2026-05-10', '14:00', 'Location 1', 'Workshop', 'upcoming', 50, 30),
  ('Workshop 2', 'Description 2', '2026-05-17', '14:00', 'Location 2', 'Workshop', 'upcoming', 50, 30),
  ('Networking', 'Description 3', '2026-05-20', '18:00', 'Location 3', 'Networking', 'upcoming', 0, 100);
```

#### Add Committee Member
```sql
INSERT INTO committee_members 
(name, role, bio, image_url, "order")
VALUES (
  'John Doe',
  'President',
  'Experienced business leader with 20 years in the industry',
  'https://example.com/john.jpg',
  1
);
```

#### Add Membership Application
```sql
INSERT INTO membership_applications 
(full_name, email, phone, address, city, postal_code, country, membership_type, payment_status)
VALUES (
  'Jane Smith',
  'jane@example.com',
  '+32123456789',
  '123 Business Street',
  'Brussels',
  '1000',
  'Belgium',
  'individual',
  'pending'
);
```

#### Add Contact Submission
```sql
INSERT INTO contact_submissions 
(name, email, subject, message)
VALUES (
  'Contact Person',
  'contact@example.com',
  'Partnership Inquiry',
  'I am interested in partnering with your organization...'
);
```

---

### READ (Query Data)

#### Get All Upcoming Events
```sql
SELECT id, title, date, time, location, price
FROM events
WHERE status = 'upcoming'
ORDER BY date ASC;
```

#### Get Event by ID
```sql
SELECT * FROM events WHERE id = 'uuid-here';
```

#### Get All Committee Members (Ordered)
```sql
SELECT name, role, bio, image_url
FROM committee_members
ORDER BY "order" ASC;
```

#### Get Committee Member by Role
```sql
SELECT * FROM committee_members WHERE role = 'President';
```

#### Get All Membership Applications
```sql
SELECT full_name, email, membership_type, payment_status, created_at
FROM membership_applications
ORDER BY created_at DESC;
```

#### Get Pending Membership Applications
```sql
SELECT * FROM membership_applications
WHERE payment_status = 'pending'
ORDER BY created_at DESC;
```

#### Get All Contact Submissions
```sql
SELECT name, email, subject, created_at
FROM contact_submissions
ORDER BY created_at DESC;
```

#### Get Recent Contact Submissions (Last 7 Days)
```sql
SELECT * FROM contact_submissions
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

#### Count Events by Category
```sql
SELECT category, COUNT(*) as total
FROM events
WHERE status = 'upcoming'
GROUP BY category
ORDER BY total DESC;
```

#### Count Membership Applications by Type
```sql
SELECT membership_type, COUNT(*) as total
FROM membership_applications
WHERE payment_status = 'completed'
GROUP BY membership_type
ORDER BY total DESC;
```

---

### UPDATE (Modify Data)

#### Update Event Status
```sql
UPDATE events
SET status = 'past'
WHERE date < CURRENT_DATE;
```

#### Update Event Details
```sql
UPDATE events
SET 
  title = 'Updated Title',
  description = 'Updated Description',
  time = '10:00'
WHERE id = 'uuid-here';
-- Note: updated_at is automatically updated by trigger
```

#### Update Membership Payment Status
```sql
UPDATE membership_applications
SET payment_status = 'completed'
WHERE id = 'uuid-here';
```

#### Update Committee Member Order
```sql
UPDATE committee_members
SET "order" = 2
WHERE name = 'John Doe';
```

#### Batch Update Event Status
```sql
UPDATE events
SET status = 'past'
WHERE date < CURRENT_DATE - INTERVAL '1 day';
```

---

### DELETE (Remove Data)

#### Delete Event by ID
```sql
DELETE FROM events WHERE id = 'uuid-here';
```

#### Delete Old Events
```sql
DELETE FROM events
WHERE date < CURRENT_DATE - INTERVAL '2 years';
```

#### Delete Specific Membership Application
```sql
DELETE FROM membership_applications WHERE id = 'uuid-here';
```

#### Delete Failed Membership Applications (Use with Caution)
```sql
DELETE FROM membership_applications
WHERE payment_status = 'failed'
AND created_at < NOW() - INTERVAL '1 year';
```

#### Delete Old Contact Submissions
```sql
DELETE FROM contact_submissions
WHERE created_at < NOW() - INTERVAL '6 months';
```

---

## Data Management

### Data Validation

#### Check for Duplicate Emails
```sql
SELECT email, COUNT(*) as count
FROM membership_applications
GROUP BY email
HAVING COUNT(*) > 1;
```

#### Find Invalid Membership Types
```sql
SELECT * FROM membership_applications
WHERE membership_type NOT IN ('individual', 'student', 'corporate');
```

#### Find Events Without Images
```sql
SELECT id, title, date
FROM events
WHERE image_url IS NULL OR image_url = '';
```

### Data Cleanup

#### Standardize Email Format
```sql
UPDATE membership_applications
SET email = LOWER(TRIM(email));
```

#### Remove Duplicate Contact Submissions (Keep Latest)
```sql
DELETE FROM contact_submissions
WHERE id NOT IN (
  SELECT DISTINCT ON (email) id
  FROM contact_submissions
  ORDER BY email, created_at DESC
);
```

---

## Queries & Reports

### Analytics Queries

#### Total Revenue from Events
```sql
SELECT 
  SUM(price * max_attendees) as potential_revenue,
  COUNT(*) as total_events
FROM events
WHERE status = 'upcoming';
```

#### Membership Applications Summary
```sql
SELECT 
  membership_type,
  COUNT(*) as total_applications,
  SUM(CASE WHEN payment_status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN payment_status = 'failed' THEN 1 ELSE 0 END) as failed
FROM membership_applications
GROUP BY membership_type;
```

#### Events by Category
```sql
SELECT 
  category,
  COUNT(*) as event_count,
  AVG(price) as avg_price,
  SUM(max_attendees) as total_capacity
FROM events
WHERE status = 'upcoming'
GROUP BY category
ORDER BY event_count DESC;
```

#### Contact Submissions by Month
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as submissions
FROM contact_submissions
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

#### Applications by Country
```sql
SELECT 
  country,
  COUNT(*) as applications,
  SUM(CASE WHEN payment_status = 'completed' THEN 1 ELSE 0 END) as paid
FROM membership_applications
GROUP BY country
ORDER BY applications DESC;
```

---

## Backup & Recovery

### Manual Backups

#### Backup Entire Database
```bash
# Full backup to file
pg_dump -U postgres -d mox_db -f mox_db_backup.sql

# Compressed backup (smaller file)
pg_dump -U postgres -d mox_db | gzip > mox_db_backup.sql.gz

# Backup specific table
pg_dump -U postgres -d mox_db -t events -f events_backup.sql
```

#### Backup All Databases
```bash
pg_dumpall -U postgres > all_databases_backup.sql
```

### Restore from Backup

#### Restore Full Database
```bash
# From SQL backup file
psql -U postgres -d mox_db -f mox_db_backup.sql

# From compressed backup
gunzip -c mox_db_backup.sql.gz | psql -U postgres -d mox_db
```

#### Restore Specific Table
```bash
psql -U postgres -d mox_db -f events_backup.sql
```

#### Restore with Drop (Replace Existing Data)
```bash
# Create new database
psql -U postgres -c "DROP DATABASE IF EXISTS mox_db;"
psql -U postgres -c "CREATE DATABASE mox_db;"

# Restore
psql -U postgres -d mox_db -f mox_db_backup.sql
```

### Automated Backup Script

**For Windows (batch file - `backup_db.bat`):**
```batch
@echo off
SET BACKUP_DIR=C:\database_backups
SET TIMESTAMP=%date:~-4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%

IF NOT EXIST %BACKUP_DIR% mkdir %BACKUP_DIR%

pg_dump -U postgres -d mox_db | gzip > %BACKUP_DIR%\mox_db_backup_%TIMESTAMP%.sql.gz

echo Backup completed: %BACKUP_DIR%\mox_db_backup_%TIMESTAMP%.sql.gz
```

**For macOS/Linux (shell script - `backup_db.sh`):**
```bash
#!/bin/bash
BACKUP_DIR="/home/user/database_backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

pg_dump -U postgres -d mox_db | gzip > $BACKUP_DIR/mox_db_backup_$TIMESTAMP.sql.gz

echo "Backup completed: $BACKUP_DIR/mox_db_backup_$TIMESTAMP.sql.gz"
```

---

## Maintenance & Optimization

### Analyze and Vacuum

#### Weekly Maintenance
```sql
-- Remove dead rows and update statistics
VACUUM ANALYZE;

-- Alternative: More aggressive cleanup
VACUUM FULL ANALYZE;
```

#### Per-Table Maintenance
```sql
VACUUM ANALYZE events;
VACUUM ANALYZE membership_applications;
VACUUM ANALYZE contact_submissions;
```

### Index Management

#### View All Indexes
```sql
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
```

#### Check Index Size
```sql
SELECT 
  indexrelname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

#### Reindex Tables
```sql
REINDEX TABLE events;
REINDEX TABLE membership_applications;
REINDEX TABLE contact_submissions;
REINDEX TABLE committee_members;
```

### Monitor Database Performance

#### Check Connection Count
```sql
SELECT datname, count(*) as connections
FROM pg_stat_activity
GROUP BY datname;
```

#### Check Slow Queries
```sql
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### Database Size
```sql
SELECT 
  pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) as size
FROM pg_database
WHERE datname = 'mox_db';
```

---

## Connection Setup

### Node.js / Express Connection

#### Install Dependencies
```bash
npm install pg
```

#### Connection Configuration
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'your_password',
  host: 'localhost',
  port: 5432,
  database: 'mox_db'
});

module.exports = pool;
```

#### Example Query
```javascript
const pool = require('./db');

// Execute query
pool.query('SELECT * FROM events WHERE status = $1', ['upcoming'], (err, res) => {
  if (err) console.error(err);
  else console.log(res.rows);
});
```

### Python Connection

#### Install Dependencies
```bash
pip install psycopg2-binary
```

#### Connection Configuration
```python
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="mox_db",
    user="postgres",
    password="your_password",
    port="5432"
)

cur = conn.cursor()
```

#### Example Query
```python
cur.execute("SELECT * FROM events WHERE status = %s", ('upcoming',))
events = cur.fetchall()
```

### Connection String Format
```
postgresql://user:password@localhost:5432/mox_db
```

---

## Troubleshooting

### Common Issues & Solutions

#### Cannot Connect to Database
```sql
-- Check if PostgreSQL is running
-- Windows: Services.msc → look for PostgreSQL
-- macOS: brew services list
-- Linux: sudo systemctl status postgresql

-- Verify port
netstat -an | findstr 5432  # Windows
lsof -i :5432              # macOS/Linux

-- Reset password (Windows)
psql -U postgres
ALTER USER postgres WITH PASSWORD 'new_password';
```

#### "Table does not exist" error
```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'events'
);

-- List all tables
\dt
```

#### Permission Denied
```sql
-- Grant permissions to user
GRANT ALL PRIVILEGES ON DATABASE mox_db TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

#### Disk Space Full
```bash
# Check disk space
df -h

# Vacuum to free space
psql -U postgres -d mox_db -c "VACUUM FULL;"
```

#### Slow Queries
```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Check for missing indexes
-- Add indexes for frequently queried columns
```

---

## Best Practices

1. **Always backup before major operations**
2. **Use transactions for related operations:**
   ```sql
   BEGIN;
   UPDATE events SET status = 'past' WHERE date < CURRENT_DATE;
   UPDATE membership_applications SET payment_status = 'completed' WHERE id = 'xxx';
   COMMIT;
   ```

3. **Use prepared statements in code** (prevents SQL injection)

4. **Regular maintenance:**
   - Weekly: VACUUM ANALYZE
   - Monthly: Check logs and slow queries
   - Quarterly: Full backup and test restoration

5. **Monitor connections:**
   ```sql
   SELECT * FROM pg_stat_activity;
   ```

6. **Use appropriate data types** - Don't store everything as TEXT

7. **Create backups before running DELETE queries**

8. **Test restore procedures regularly**

9. **Document custom functions and triggers**

10. **Keep password secure** - Use environment variables

---

## Quick Reference Commands

```bash
# Connect to database
psql -U postgres -d mox_db

# Execute SQL file
psql -U postgres -d mox_db -f file.sql

# Backup
pg_dump -U postgres -d mox_db > backup.sql

# Restore
psql -U postgres -d mox_db < backup.sql

# List databases
psql -U postgres -l

# List tables (in psql)
\dt

# Describe table (in psql)
\d table_name

# Exit psql
\q
```

---

## Support & Resources

- **PostgreSQL Documentation:** [postgresql.org/docs](https://www.postgresql.org/docs/)
- **pgAdmin Documentation:** [pgadmin.org/docs](https://www.pgadmin.org/docs/)
- **DBeaver Guide:** [dbeaver.io/docs](https://dbeaver.io/docs/)
- **PostgreSQL Tutorials:** [postgresql.org/docs/current/sql.html](https://www.postgresql.org/docs/current/sql.html)

---

**Last Updated:** March 2026
**Database Version:** PostgreSQL 14+
**Schema Version:** 1.0
