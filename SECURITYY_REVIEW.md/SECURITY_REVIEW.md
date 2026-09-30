# Security Review - E-commerce REST API

## 1. Overview

This security review documents the main security risks identified in the E-commerce REST API and the security controls implemented during Stage 3.

The API uses Node.js, Express.js, PostgreSQL/Neon, JWT authentication, bcrypt password hashing, Helmet, CORS restrictions, rate limiting, input validation, and parameterized SQL queries.

---

## 2. Security Issues Identified and Mitigations

### 1. Plaintext Password Storage

**Risk:**
Storing user passwords as plain text would expose passwords if the database were compromised.

**Mitigation:**
Passwords are hashed using bcrypt before being stored in the database.

**Implemented:**
`bcrypt.hash(password, 10)`

**Verification:**
The `hash_password` value stored in the database starts with a bcrypt prefix such as `$2b$10$`.

---

### 2. Password Hash Exposure

**Risk:**
Returning `hash_password` in API responses could expose sensitive authentication information.

**Mitigation:**
User queries return only required user fields and never return `hash_password`.

**Verification:**
User creation, login, and user retrieval responses do not contain `hash_password`.

---

### 3. SQL Injection

**Risk:**
Building SQL queries using user input directly can allow SQL injection attacks.

**Mitigation:**
Parameterized PostgreSQL queries are used throughout the API.

**Example:**

```js
WHERE id = $1
```

with values supplied separately.

---

### 4. Broken Authentication

**Risk:**
Sensitive endpoints could be accessed without verifying the user's identity.

**Mitigation:**
JWT authentication middleware was implemented.

Protected endpoints require a valid Bearer token.

**Verification:**
Requests without a valid token return HTTP `401 Unauthorized`.

---

### 5. Broken Authorization / IDOR

**Risk:**
A logged-in customer could attempt to access another user's data by changing the user ID in the URL.

**Mitigation:**
User ownership is checked before returning user data.

Customers can access only their own data, while administrators can access user data as permitted.

**Verification:**
Accessing another user's data as a customer returns HTTP `403 Forbidden`.

---

### 6. Privilege Escalation

**Risk:**
A normal user could attempt to register with an administrator role.

**Mitigation:**
Public registration always creates the account with the `customer` role.

**Verification:**
Sending `"role": "admin"` during registration does not create an administrator account.

---

### 7. Missing Role Authorization

**Risk:**
Customers could attempt to perform administrator-only operations such as creating products, creating categories, or changing user status.

**Mitigation:**
Administrator authorization middleware was implemented.

**Verification:**
Customer requests to administrator-only endpoints return HTTP `403 Forbidden`.

---

### 8. Cross-Site Scripting (XSS)

**Risk:**
Malicious script content submitted through product fields could potentially be stored and later executed by a client application.

**Mitigation:**
Input validation was added to reject script tags in product name and description fields.

**Verification:**
An XSS test containing:

```html
<script>alert('XSS')</script>
```

returned HTTP `400 Bad Request`.

---

### 9. Missing Security Headers

**Risk:**
Missing HTTP security headers can increase exposure to several browser-based attacks.

**Mitigation:**
Helmet middleware was added.

```js
app.use(helmet());
```

---

### 10. Unrestricted Cross-Origin Requests

**Risk:**
Allowing requests from any origin can expose the API to unwanted cross-origin access.

**Mitigation:**
CORS was restricted to the approved frontend origin.

```text
http://localhost:5173
```

---

### 11. Brute-Force / Excessive Requests

**Risk:**
Attackers could repeatedly send requests, especially login attempts, to guess credentials or overload the API.

**Mitigation:**
Rate limiting was implemented.

The API uses a general rate limit and a stricter login rate limit.

* API: 100 requests per 15 minutes
* Login: 10 requests per 15 minutes

---

### 12. Excessive Request Body Size

**Risk:**
Very large request bodies can consume server resources and contribute to denial-of-service attacks.

**Mitigation:**
The Express JSON body parser is limited to 10 KB.

```js
express.json({ limit: "10kb" })
```

---

## 3. Authentication and Authorization

The API implements:

* JWT authentication
* Protected API routes
* Customer and administrator roles
* Administrator-only operations
* User ownership checks
* Inactive account protection
* Password hashing using bcrypt

---

## 4. Input Validation

Input validation is implemented for important authentication and user operations.

Examples include:

* Required fields
* Valid email format
* Minimum password length
* Valid user IDs
* Boolean validation for user status
* XSS/script input protection

---

## 5. Secure Error Handling

The API uses centralized error handling and avoids returning sensitive internal information to clients.

Unexpected server errors return:

```json
{
  "message": "Internal server error"
}
```

Sensitive database and authentication details are not exposed in normal API responses.

---

## 6. Security Testing Summary

Security testing was performed using Postman.

Tested areas include:

* User registration
* User login
* JWT authentication
* Protected endpoints
* Invalid authentication
* IDOR protection
* Customer authorization
* Administrator authorization
* Password validation
* Duplicate email handling
* Password hashing
* Privilege escalation prevention
* XSS protection
* Product authorization
* Category authorization

---

## 7. Conclusion

The E-commerce REST API was reviewed and enhanced with multiple security controls covering authentication, authorization, password protection, input validation, SQL injection prevention, XSS protection, security headers, CORS restrictions, rate limiting, and secure error handling.

The implemented controls were tested using Postman and database verification where appropriate.
