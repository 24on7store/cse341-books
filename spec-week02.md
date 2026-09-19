# Books & Authors API Week 02 Spec - Version 1.1 (Version 2)

## Purpose & Global Constraints
- **Purpose:** Upgrade the read-only application to a full CRUD (Create, Read, Update, Delete) engine handling books and authors with relational integrity.
- **Data Validation:** All incoming string values must be non-empty (`""` or white spaces are rejected). All date fields must rigidly adhere to the ISO 8601 date format (`"YYYY-MM-DD"`).
- **Security:** Raw system or MongoDB driver stack traces must be suppressed. Critical exceptions must cleanly return `{ "message": "Internal server error" }`.
- **Primary Scoping:** Routes query using custom `id` strings (`"b1"`, `"a1"`) instead of native MongoDB `_id` hashes.

---

## Feature 1: Book CRUD Operations and Author References

### Data Model
Stored in the `books` collection.
- `id`: string, required, unique pattern (e.g., `"b4"`)
- `authorId`: string, required, must explicitly match an existing author's custom `id`
- `title`: string, required, non-empty
- `publicationDate`: string, required, format `"YYYY-MM-DD"`

### Relational Check Rule
When receiving a `POST /books` or `PUT /books/:id` request, the server must perform a query verification against the `authors` collection. If the targeted `authorId` does not exist, the insertion/modification must abort immediately.

### Endpoints

#### 1. GET /books
- **Success:** `200 OK` | Body: Array of all book objects.
- **Error:** `500 Internal Server Error` | Body: `{ "message": "Internal server error" }`

#### 2. GET /books/:id
- **Success:** `200 OK` | Body: Single matching book object.
- **Client Error:** `404 Not Found` | Body: `{ "message": "Book not found" }`
- **System Error:** `500 Internal Server Error` | Body: `{ "message": "Internal server error" }`

#### 3. POST /books
- **Input JSON Payload Example:**
  ```json
  {
    "id": "b4",
    "authorId": "a1",
    "title": "Example Book Title",
    "publicationDate": "2026-01-15"
  }
  ```
- **Success:** `201 Created` | Body: The newly inserted book document object.
- **Validation Errors (`400 Bad Request`):**
  - Missing or blank field: `{ "message": "Validation failed: All fields are required." }`
  - ID collision: `{ "message": "Book ID already exists." }`
  - Broken reference: `{ "message": "Author ID does not match an existing author." }`
- **System Error:** `500 Internal Server Error`

#### 4. PUT /books/:id
- **Input JSON Payload Example:**
  ```json
  {
    "authorId": "a2",
    "title": "Updated Book Title",
    "publicationDate": "2026-02-20"
  }
  ```
- **Success:** `200 OK` | Body: The full updated state of the book object.
- **Client Errors:**
  - Missing fields / Invalid formatting: `400 Bad Request` | `{ "message": "Validation failed: Check your input values." }`
  - Broken reference: `400 Bad Request` | `{ "message": "Author ID does not match an existing author." }`
  - Target book missing: `404 Not Found` | `{ "message": "Book not found" }`
- **System Error:** `500 Internal Server Error`

#### 5. DELETE /books/:id
- **Success:** `204 No Content` | Body: Empty / None.
- **Client Error:** `404 Not Found` | Body: `{ "message": "Book not found" }`
- **System Error:** `500 Internal Server Error`

---

## Feature 2: Author CRUD Operations

### Data Model
Stored in the `authors` collection.
- `id`: string, required, unique pattern (e.g., `"a3"`)
- `name`: string, required, non-empty
- `nationality`: string, required, non-empty
- `birthDate`: string, required, format `"YYYY-MM-DD"`

### Data Integrity Rule (Cascade Protection)
Before processing a `DELETE /authors/:id` operation, the server must query the `books` collection using a rapid checkpoint search (`.findOne({ authorId: id })`). If any matching book document is found pointing to that author, the process must instantly block the execution to protect relational link paths.

### Endpoints

#### 1. GET /authors
- **Success:** `200 OK` | Body: Array of all author objects.
- **Error:** `500 Internal Server Error`

#### 2. GET /authors/:id
- **Success:** `200 OK` | Body: Single matching author object.
- **Client Error:** `404 Not Found` | Body: `{ "message": "Author not found" }`
- **System Error:** `500 Internal Server Error`

#### 3. POST /authors
- **Input JSON Payload Example:**
  ```json
  {
    "id": "a3",
    "name": "Arthur C. Clarke",
    "nationality": "British",
    "birthDate": "1917-12-16"
  }
  ```
- **Success:** `201 Created` | Body: The newly inserted author document object.
- **Validation Errors (`400 Bad Request`):**
  - Missing/Empty field: `{ "message": "Validation failed: Name, nationality, and birth date are required." }`
  - ID collision: `{ "message": "Author ID already exists." }`
- **System Error:** `500 Internal Server Error`

#### 4. PUT /authors/:id
- **Input JSON Payload Example:**
  ```json
  {
    "name": "Arthur Charles Clarke",
    "nationality": "British",
    "birthDate": "1917-12-16"
  }
  ```
- **Success:** `200 OK` | Body: The updated author object.
- **Client Errors:**
  - Blank/Malformed variables: `400 Bad Request` | `{ "message": "Validation failed: Provide complete data." }`
  - Missing resource target: `404 Not Found` | `{ "message": "Author not found" }`
- **System Error:** `500 Internal Server Error`

#### 5. DELETE /authors/:id
- **Success:** `204 No Content` | Body: Empty / None.
- **Client Errors:**
  - Relational lock failure: `400 Bad Request` | `{ "message": "Cannot delete author: This author is still linked to active books." }`
  - Missing resource target: `404 Not Found` | `{ "message": "Author not found" }`
- **System Error:** `500 Internal Server Error`
