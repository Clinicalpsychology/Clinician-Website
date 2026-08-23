# Database Schema Documentation

## Overview

The PostgreSQL database schema is designed to support a comprehensive psychologist directory platform with booking, payment, and review functionality.

## Tables

### 1. users
Main user table for all account types (regular users, psychologists, admins).

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| first_name | VARCHAR(255) | - | User's first name |
| last_name | VARCHAR(255) | - | User's last name |
| phone | VARCHAR(20) | - | Contact phone number |
| profile_picture_url | VARCHAR(500) | - | URL to profile photo |
| user_type | ENUM | NOT NULL, DEFAULT 'regular_user' | User role: regular_user, psychologist, admin |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |

**Indexes**
- `idx_users_email` - For fast email lookups during login

---

### 2. psychologists
Psychologist profile information and credentials.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique psychologist identifier |
| user_id | INT | UNIQUE, NOT NULL, FK | Reference to users table |
| license_number | VARCHAR(255) | UNIQUE, NOT NULL | License/registration number |
| license_verified | BOOLEAN | DEFAULT FALSE | Admin verification status |
| license_verification_date | TIMESTAMP | - | Date of verification |
| bio | TEXT | - | Professional biography |
| years_experience | INT | - | Years in practice |
| hourly_rate | DECIMAL(10,2) | - | Session rate in dollars |
| max_concurrent_clients | INT | DEFAULT 20 | Maximum active clients |
| accepting_new_clients | BOOLEAN | DEFAULT TRUE | Accepts new clients flag |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Profile creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last profile update |

**Indexes**
- `idx_psychologists_user_id` - For finding psychologist by user
- `idx_psychologists_license` - For license verification checks

---

### 3. psychologist_specializations
Areas of clinical expertise for each psychologist.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique record identifier |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists |
| specialization | VARCHAR(100) | NOT NULL | Specialization area (e.g., "anxiety", "depression") |

**Indexes**
- `idx_psychologist_specializations_psychologist_id` - Query specializations by psychologist
- `idx_psychologist_specializations_specialization` - Query psychologists by specialization

**Unique Constraint**
- `unique_spec (psychologist_id, specialization)` - Prevent duplicate specializations

**Sample Values**
- anxiety
- depression
- trauma
- bipolar_disorder
- ocd
- ptsd
- panic_disorder
- social_anxiety
- couples_therapy
- family_therapy
- child_psychology
- eating_disorders
- addiction
- grief_counseling
- stress_management

---

### 4. psychologist_services
Services offered by psychologists.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique service identifier |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists |
| service_name | VARCHAR(255) | NOT NULL | Service title |
| service_description | TEXT | - | Detailed service description |
| service_type | ENUM | NOT NULL | individual, couples, group, family |
| delivery_method | ENUM | NOT NULL | in_person, online, hybrid |
| price | DECIMAL(10,2) | - | Service cost |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |

**Index**
- `idx_psychologist_services_psychologist_id` - Query services by psychologist

---

### 5. psychologist_languages
Languages spoken by each psychologist.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique record identifier |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists |
| language | VARCHAR(100) | NOT NULL | Language name |

**Unique Constraint**
- `unique_lang (psychologist_id, language)` - Prevent duplicates

**Sample Values**
- English
- Spanish
- French
- German
- Mandarin
- Arabic
- Hindi
- Portuguese
- Japanese
- Korean

---

### 6. clinic_locations
Physical or virtual clinic locations for appointments.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique location identifier |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists |
| clinic_name | VARCHAR(255) | - | Clinic or practice name |
| street_address | VARCHAR(500) | NOT NULL | Street address |
| city | VARCHAR(100) | NOT NULL | City name |
| state_province | VARCHAR(100) | - | State/province |
| postal_code | VARCHAR(20) | - | ZIP/postal code |
| country | VARCHAR(100) | NOT NULL | Country name |
| latitude | DECIMAL(10,8) | - | GPS latitude for mapping |
| longitude | DECIMAL(11,8) | - | GPS longitude for mapping |
| phone | VARCHAR(20) | - | Clinic phone number |
| is_primary | BOOLEAN | DEFAULT FALSE | Primary location flag |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |

**Index**
- `idx_clinic_locations_psychologist_id` - Query locations by psychologist
- `idx_clinic_locations_city_country` - Geographic filtering

---

### 7. psychologist_education
Educational background and degrees.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique education record |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists |
| institution_name | VARCHAR(255) | NOT NULL | University/school name |
| degree | VARCHAR(100) | NOT NULL | Degree earned (PhD, Masters, etc.) |
| field_of_study | VARCHAR(255) | - | Major/specialization |
| graduation_year | INT | - | Year graduated |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |

**Index**
- `idx_psychologist_education_psychologist_id` - Query education by psychologist

---

### 8. psychologist_certifications
Professional certifications and licenses.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique certification record |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists |
| certification_name | VARCHAR(255) | NOT NULL | Certification/license name |
| issuing_organization | VARCHAR(255) | - | Organization that issued |
| issue_date | DATE | - | Date issued |
| expiry_date | DATE | - | Expiration date (if applicable) |
| certificate_url | VARCHAR(500) | - | URL to certificate document |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |

**Index**
- `idx_psychologist_certifications_psychologist_id` - Query certifications by psychologist

---

### 9. psychologist_availability
Weekly availability schedule.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique availability record |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists |
| day_of_week | INT | NOT NULL, DEFAULT 0 | Day: 0=Sun, 1=Mon, ..., 6=Sat |
| start_time | TIME | NOT NULL | Availability start time (HH:MM) |
| end_time | TIME | NOT NULL | Availability end time (HH:MM) |
| is_available | BOOLEAN | DEFAULT TRUE | Availability flag |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |

**Index**
- `idx_psychologist_availability_psychologist_id` - Query availability by psychologist

**Example**
```
psychologist_id: 1
day_of_week: 1 (Monday)
start_time: 09:00
end_time: 17:00
is_available: true
```

---

### 10. bookings
Appointment bookings/reservations.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique booking identifier |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists |
| user_id | INT | NOT NULL, FK | Reference to users (client) |
| appointment_date | TIMESTAMP | NOT NULL | Appointment date/time |
| duration_minutes | INT | DEFAULT 60 | Session duration in minutes |
| status | ENUM | DEFAULT 'pending' | pending, confirmed, completed, cancelled, no_show |
| meeting_type | ENUM | NOT NULL | in_person, video_call, phone_call |
| notes | TEXT | - | Session notes |
| cancellation_reason | VARCHAR(500) | - | Reason for cancellation |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Booking creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes**
- `idx_bookings_psychologist_id` - Query bookings by psychologist
- `idx_bookings_user_id` - Query bookings by user
- `idx_bookings_appointment_date` - Query bookings by date range
- `idx_bookings_status` - Filter bookings by status

---

### 11. payments
Payment transactions and billing.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique payment identifier |
| booking_id | INT | - | FK to bookings (optional, for standalone payments) |
| user_id | INT | NOT NULL, FK | Reference to users (payer) |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists (payee) |
| amount | DECIMAL(10,2) | NOT NULL | Total payment amount |
| commission_amount | DECIMAL(10,2) | - | Platform commission |
| platform_fee | DECIMAL(10,2) | - | Additional platform fees |
| payment_method | ENUM | NOT NULL | credit_card, debit_card, bank_transfer, digital_wallet |
| status | ENUM | DEFAULT 'pending' | pending, completed, failed, refunded |
| stripe_payment_id | VARCHAR(255) | - | Stripe PaymentIntent ID |
| stripe_charge_id | VARCHAR(255) | - | Stripe Charge ID |
| transaction_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Payment date |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |

**Indexes**
- `idx_payments_user_id` - Query payments by user
- `idx_payments_psychologist_id` - Query payments by psychologist
- `idx_payments_status` - Filter payments by status

**Payment Flow**
1. User initiates payment
2. Stripe processes payment (status: pending)
3. On success: status → completed, stripe_charge_id populated
4. Psychologist receives payment minus commission
5. Platform receives commission

---

### 12. reviews
Client reviews and ratings for psychologists.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique review identifier |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists |
| user_id | INT | NOT NULL, FK | Reference to users (reviewer) |
| booking_id | INT | - | FK to bookings (optional verification) |
| rating | INT | NOT NULL, CHECK (1-5) | Rating from 1 to 5 stars |
| title | VARCHAR(255) | - | Review title/headline |
| review_text | TEXT | - | Full review content |
| is_verified_booking | BOOLEAN | DEFAULT FALSE | Verified booking flag |
| is_published | BOOLEAN | DEFAULT TRUE | Publication status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Review creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes**
- `idx_reviews_psychologist_id` - Query reviews by psychologist
- `idx_reviews_rating` - Query by rating (for statistics)

**Statistics Query Example**
```sql
SELECT 
  AVG(rating) as average_rating,
  COUNT(*) as total_reviews,
  ROUND(AVG(rating)::numeric, 2) as rounded_average
FROM reviews
WHERE psychologist_id = 1 AND is_published = true
```

---

### 13. messages
Direct messaging between users.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique message identifier |
| sender_id | INT | NOT NULL, FK | Reference to users (sender) |
| recipient_id | INT | NOT NULL, FK | Reference to users (recipient) |
| subject | VARCHAR(255) | - | Message subject |
| message_body | TEXT | NOT NULL | Message content |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| is_archived | BOOLEAN | DEFAULT FALSE | Archive status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Message creation date |
| read_at | TIMESTAMP | - | Timestamp when message was read |

**Indexes**
- `idx_messages_sender_id` - Query messages by sender
- `idx_messages_recipient_id` - Query messages by recipient

---

### 14. wishlists
User favorites for bookmarking psychologists.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique wishlist record |
| user_id | INT | NOT NULL, FK | Reference to users |
| psychologist_id | INT | NOT NULL, FK | Reference to psychologists |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Added to wishlist date |

**Unique Constraint**
- `unique_wishlist (user_id, psychologist_id)` - Prevent duplicate wishlist items

**Indexes**
- `idx_wishlists_user_id` - Query user's wishlist
- `idx_wishlists_psychologist_id` - Query psychologist's wishlist popularity

---

### 15. admin_logs
Audit trail of administrative actions.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Unique log entry |
| admin_id | INT | NOT NULL, FK | Reference to admin user |
| action | VARCHAR(255) | NOT NULL | Action performed |
| entity_type | VARCHAR(100) | - | Type of entity affected |
| entity_id | INT | - | ID of entity affected |
| changes | JSON | - | JSON object of changes made |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Action timestamp |

**Index**
- No specific index, but useful for audit queries

**Example Changes JSON**
```json
{
  "license_verified": { "from": false, "to": true },
  "accepting_new_clients": { "from": true, "to": false }
}
```

---

## Data Relationships

```
users
  ├── psychologists (1:1 via user_id)
  │   ├── psychologist_specializations (1:M)
  │   ├── psychologist_services (1:M)
  │   ├── psychologist_languages (1:M)
  │   ├── clinic_locations (1:M)
  │   ├── psychologist_education (1:M)
  │   ├── psychologist_certifications (1:M)
  │   ├── psychologist_availability (1:M)
  │   ├── bookings (1:M)
  │   ├── payments (1:M)
  │   ├── reviews (1:M)
  │   └── wishlists (1:M)
  ├── bookings (1:M via user_id as client)
  ├── payments (1:M via user_id as payer)
  ├── reviews (1:M via user_id as reviewer)
  ├── messages (1:M via sender_id and recipient_id)
  └── wishlists (1:M via user_id)

bookings
  ├── psychologists (M:1)
  ├── users (M:1 via user_id)
  ├── payments (1:M)
  └── reviews (1:M)

payments
  ├── bookings (M:1 optional)
  ├── users (M:1 via user_id)
  └── psychologists (M:1)
```

---

## Key Queries

### Find Psychologists by Specialization and Location
```sql
SELECT DISTINCT p.*
FROM psychologists p
JOIN users u ON p.user_id = u.id
JOIN psychologist_specializations ps ON p.id = ps.psychologist_id
JOIN clinic_locations cl ON p.id = cl.psychologist_id
WHERE ps.specialization = 'anxiety'
  AND cl.city = 'New York'
  AND p.license_verified = true
  AND p.accepting_new_clients = true
ORDER BY p.created_at DESC;
```

### Get Psychologist with Average Rating
```sql
SELECT 
  p.*,
  u.first_name,
  u.last_name,
  u.profile_picture_url,
  ROUND(AVG(r.rating)::numeric, 2) as average_rating,
  COUNT(r.id) as total_reviews
FROM psychologists p
JOIN users u ON p.user_id = u.id
LEFT JOIN reviews r ON p.id = r.psychologist_id AND r.is_published = true
WHERE p.id = $1
GROUP BY p.id, u.id;
```

### Check Availability
```sql
SELECT *
FROM psychologist_availability
WHERE psychologist_id = $1
  AND day_of_week = EXTRACT(DOW FROM $2::timestamp)
  AND start_time <= TO_CHAR($2::timestamp, 'HH:MM')::time
  AND end_time >= TO_CHAR($2::timestamp, 'HH:MM')::time
  AND is_available = true;
```

### Get Revenue Statistics
```sql
SELECT 
  p.id,
  u.first_name,
  u.last_name,
  COUNT(pay.id) as total_sessions,
  SUM(pay.amount) as total_revenue,
  SUM(pay.commission_amount) as commission_paid,
  SUM(pay.amount - COALESCE(pay.commission_amount, 0)) as net_revenue
FROM psychologists p
JOIN users u ON p.user_id = u.id
LEFT JOIN payments pay ON p.id = pay.psychologist_id AND pay.status = 'completed'
WHERE pay.created_at >= DATE_TRUNC('month', NOW())
GROUP BY p.id, u.id;
```

---

## Performance Considerations

1. **Indexing Strategy**: All foreign keys and commonly filtered fields are indexed
2. **Partitioning**: Consider partitioning `bookings` and `payments` tables by date for very large datasets
3. **Materialized Views**: Create for frequently used complex queries like psychologist search results
4. **Caching**: Cache psychologist profiles and search results in Redis
5. **Batch Operations**: Use batch inserts for bulk data operations

---

## Backup and Recovery

- Daily automated backups to AWS S3
- Point-in-time recovery capability (7 days)
- Monthly full backups stored for 1 year
- Test recovery procedures monthly

---

**Last Updated**: August 23, 2026
