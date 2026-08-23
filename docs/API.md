# API Documentation

## Overview

The Psychologist Directory API is a RESTful API built with Express.js and TypeScript. All endpoints return JSON responses and use JWT for authentication.

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://api.psychologistdirectory.com/api`

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2026-08-23T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  },
  "timestamp": "2026-08-23T10:30:00.000Z"
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "regular_user"
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "user_type": "regular_user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/login
Login to existing account.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "user_type": "regular_user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/refresh
Refresh JWT token.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/logout
Logout current user.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## Psychologist Endpoints

### GET /psychologists
Get list of psychologists with filtering and pagination.

**Query Parameters**
- `page` (integer, default: 1) - Page number for pagination
- `limit` (integer, default: 20) - Number of results per page
- `specialization` (string) - Filter by specialization
- `location` (string) - Filter by city/location
- `languages` (string, comma-separated) - Filter by languages
- `delivery_method` (string) - Filter by delivery method (in_person, online, hybrid)
- `min_rating` (number) - Minimum rating filter
- `verified_only` (boolean) - Show only license-verified psychologists
- `accepting_clients` (boolean) - Show only those accepting new clients
- `search` (string) - Search by name or bio

**Example Request**
```
GET /psychologists?specialization=anxiety&location=New York&page=1&limit=20
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "psychologists": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "email": "dr.smith@example.com",
          "first_name": "Dr. Sarah",
          "last_name": "Smith",
          "profile_picture_url": "https://..."
        },
        "license_number": "PSY-2024-001",
        "license_verified": true,
        "years_experience": 10,
        "hourly_rate": 150,
        "bio": "Specializing in anxiety disorders...",
        "specializations": ["anxiety", "depression", "trauma"],
        "services": [
          {
            "id": 1,
            "service_name": "Individual Therapy",
            "service_type": "individual",
            "delivery_method": "online",
            "price": 150
          }
        ],
        "languages": ["English", "Spanish"],
        "clinic_locations": [...],
        "education": [...],
        "certifications": [...],
        "availability": [...],
        "average_rating": 4.8,
        "total_reviews": 45
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

### GET /psychologists/:id
Get detailed psychologist profile.

**Path Parameters**
- `id` (integer) - Psychologist ID

**Response** (200 OK)
```json
{
  "success": true,
  "data": { /* psychologist object */ }
}
```

### POST /psychologists
Create psychologist profile (Admin only).

**Headers**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body**
```json
{
  "user_id": 1,
  "license_number": "PSY-2024-001",
  "bio": "Expert psychologist with 10+ years experience",
  "years_experience": 10,
  "hourly_rate": 150,
  "specializations": ["anxiety", "depression"],
  "languages": ["English", "Spanish"],
  "clinic_locations": [...],
  "education": [...],
  "certifications": [...]
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "data": { /* created psychologist */ }
}
```

### PATCH /psychologists/:id
Update psychologist profile (Psychologist or Admin only).

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters**
- `id` (integer) - Psychologist ID

**Request Body**
```json
{
  "bio": "Updated bio...",
  "hourly_rate": 160,
  "accepting_new_clients": true
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": { /* updated psychologist */ }
}
```

### DELETE /psychologists/:id
Delete psychologist profile (Admin only).

**Headers**
```
Authorization: Bearer <admin_jwt_token>
```

**Path Parameters**
- `id` (integer) - Psychologist ID

**Response** (200 OK)
```json
{
  "success": true,
  "data": { "message": "Psychologist deleted successfully" }
}
```

---

## Booking Endpoints

### GET /bookings
Get user's bookings.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**
- `status` (string) - Filter by status (pending, confirmed, completed, cancelled, no_show)
- `from_date` (date) - Filter bookings from this date
- `to_date` (date) - Filter bookings until this date

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": 1,
        "psychologist_id": 1,
        "user_id": 2,
        "appointment_date": "2026-09-15T14:00:00Z",
        "duration_minutes": 60,
        "status": "confirmed",
        "meeting_type": "video_call",
        "notes": "Discuss anxiety management techniques"
      }
    ]
  }
}
```

### POST /bookings
Create new booking.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request Body**
```json
{
  "psychologist_id": 1,
  "appointment_date": "2026-09-15T14:00:00Z",
  "duration_minutes": 60,
  "meeting_type": "video_call",
  "notes": "Discuss anxiety management techniques"
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "data": { /* created booking */ }
}
```

### GET /bookings/:id
Get booking details.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": { /* booking details */ }
}
```

### PATCH /bookings/:id
Update booking (cancel or reschedule).

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request Body**
```json
{
  "status": "cancelled",
  "cancellation_reason": "Had to reschedule",
  "new_appointment_date": "2026-09-22T14:00:00Z"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": { /* updated booking */ }
}
```

### DELETE /bookings/:id
Cancel booking.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": { "message": "Booking cancelled successfully" }
}
```

---

## Payment Endpoints

### POST /payments
Process payment for booking.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request Body**
```json
{
  "booking_id": 1,
  "amount": 150,
  "payment_method": "credit_card",
  "stripe_token": "tok_visa"
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "booking_id": 1,
    "amount": 150,
    "status": "completed",
    "stripe_charge_id": "ch_1234567890"
  }
}
```

### GET /payments/:id
Get payment details.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": { /* payment details */ }
}
```

### GET /payments
Get user's payment history.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "payments": [ /* array of payments */ ]
  }
}
```

---

## Review Endpoints

### POST /reviews
Create review for psychologist.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request Body**
```json
{
  "psychologist_id": 1,
  "booking_id": 1,
  "rating": 5,
  "title": "Excellent therapist",
  "review_text": "Dr. Smith was very helpful and professional..."
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "data": { /* created review */ }
}
```

### GET /reviews/:psychologistId
Get reviews for psychologist.

**Query Parameters**
- `page` (integer, default: 1)
- `limit` (integer, default: 10)
- `sort` (string) - Sort by: recent, helpful, rating_high, rating_low

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "reviews": [...],
    "average_rating": 4.8,
    "total_reviews": 45
  }
}
```

### PATCH /reviews/:id
Update review.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request Body**
```json
{
  "rating": 4,
  "review_text": "Updated review text..."
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": { /* updated review */ }
}
```

### DELETE /reviews/:id
Delete review.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": { "message": "Review deleted successfully" }
}
```

---

## Error Codes

- `INVALID_TOKEN` - JWT token is invalid or expired
- `NO_TOKEN` - No authentication token provided
- `UNAUTHORIZED` - User not authenticated
- `FORBIDDEN` - User doesn't have required permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `VALIDATION_ERROR` - Input validation failed
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address.

- **Rate Limit Header**: `X-RateLimit-Limit: 100`
- **Remaining Requests**: `X-RateLimit-Remaining: 95`
- **Reset Time**: `X-RateLimit-Reset: 1694340600`

---

## Webhooks

### Payment Webhook
Stripe webhook for payment updates.

**Endpoint**: `POST /webhooks/stripe`

**Events**
- `payment_intent.succeeded` - Payment completed
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed

---

## Version History

**v1.0.0** (Current)
- Initial release with core functionality

---

For more information or support, please contact: support@psychologistdirectory.com
