-- Psychologist Directory PostgreSQL Schema

CREATE TYPE user_type AS ENUM ('regular_user', 'psychologist', 'admin');
CREATE TYPE service_type AS ENUM ('individual', 'couples', 'group', 'family');
CREATE TYPE delivery_method AS ENUM ('in_person', 'online', 'hybrid');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE meeting_type AS ENUM ('in_person', 'video_call', 'phone_call');
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'bank_transfer', 'digital_wallet');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  profile_picture_url VARCHAR(500),
  user_type user_type NOT NULL DEFAULT 'regular_user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE psychologists (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(255) UNIQUE NOT NULL,
  license_verified BOOLEAN NOT NULL DEFAULT FALSE,
  license_verification_date TIMESTAMPTZ,
  bio TEXT,
  years_experience INT CHECK (years_experience >= 0),
  hourly_rate NUMERIC(10, 2) CHECK (hourly_rate >= 0),
  max_concurrent_clients INT NOT NULL DEFAULT 20,
  accepting_new_clients BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE psychologist_specializations (
  id SERIAL PRIMARY KEY,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  specialization VARCHAR(100) NOT NULL,
  CONSTRAINT unique_specialization UNIQUE (psychologist_id, specialization)
);

CREATE TABLE psychologist_services (
  id SERIAL PRIMARY KEY,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  service_description TEXT,
  service_type service_type NOT NULL,
  delivery_method delivery_method NOT NULL,
  price NUMERIC(10, 2) CHECK (price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE psychologist_languages (
  id SERIAL PRIMARY KEY,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  language VARCHAR(100) NOT NULL,
  CONSTRAINT unique_language UNIQUE (psychologist_id, language)
);

CREATE TABLE clinic_locations (
  id SERIAL PRIMARY KEY,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  clinic_name VARCHAR(255),
  street_address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  phone VARCHAR(20),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE psychologist_education (
  id SERIAL PRIMARY KEY,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  institution_name VARCHAR(255) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  field_of_study VARCHAR(255),
  graduation_year INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE psychologist_certifications (
  id SERIAL PRIMARY KEY,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  certification_name VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  certificate_url VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE psychologist_availability (
  id SERIAL PRIMARY KEY,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (end_time > start_time)
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_date TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  status booking_status NOT NULL DEFAULT 'pending',
  meeting_type meeting_type NOT NULL,
  notes TEXT,
  cancellation_reason VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(id) ON DELETE SET NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  commission_amount NUMERIC(10, 2) CHECK (commission_amount >= 0),
  platform_fee NUMERIC(10, 2) CHECK (platform_fee >= 0),
  payment_method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  stripe_payment_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id INT REFERENCES bookings(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  review_text TEXT,
  is_verified_booking BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  message_body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMPTZ
);

CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  psychologist_id INT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_wishlist UNIQUE (user_id, psychologist_id)
);

CREATE TABLE admin_logs (
  id SERIAL PRIMARY KEY,
  admin_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INT,
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_psychologists_user_id ON psychologists(user_id);
CREATE INDEX idx_psychologists_license ON psychologists(license_number);
CREATE INDEX idx_specializations_name ON psychologist_specializations(specialization);
CREATE INDEX idx_locations_city_country ON clinic_locations(city, country);
CREATE INDEX idx_bookings_psychologist_date ON bookings(psychologist_id, appointment_date);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_reviews_psychologist_id ON reviews(psychologist_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
