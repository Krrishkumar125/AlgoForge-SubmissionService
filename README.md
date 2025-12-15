# Submission Service

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Fastify-5.x-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Redis-Required-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License">
</p>

<p align="center">
  <b>Orchestrator microservice that coordinates the entire code evaluation workflow</b>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Code Stub Injection](#code-stub-injection)
- [Queue System](#queue-system)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Overview

The Submission Service orchestrates code evaluation by coordinating between Problem Service, Evaluator Service, and Socket Service. It handles submission creation, code stub injection, job queuing, result processing, and real-time notifications.

**Key Features:**

- 🔄 Workflow orchestration across multiple services
- 💉 Automatic language-specific code stub injection
- 📬 Queue-based async processing with BullMQ
- 📡 Real-time notifications via WebSocket
- 🗃️ MongoDB persistence with status tracking

---

## Architecture

**Service Type:** REST API + Queue Worker

**Data Flow:**

```
Client → Submission Service → Problem Service (fetch stubs/tests)
            ↓
      MongoDB (save)
            ↓
      SubmissionQueue → Evaluator Service → EvaluationQueue
            ↓                                      ↓
      Worker consumes                    Update MongoDB status
            ↓
      Socket Service (notify user)
```

**Responsibilities:**

- Accept and validate code submissions
- Fetch problem metadata and inject code stubs
- Queue execution jobs with test cases
- Process evaluation results and update status
- Trigger real-time user notifications

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Fastify 5.x |
| **Database** | MongoDB 6.0+ (Mongoose) |
| **Queue** | BullMQ + Redis |
| **HTTP Client** | Axios |
| **Validation** | class-validator |

**Project Structure:**

```
src/
├── config/         # Environment & service configs
├── models/         # Mongoose schemas
├── repository/     # Database operations
├── services/       # Business logic
├── controllers/    # Request handlers
├── routes/         # API endpoints
├── apis/           # External service clients
├── queues/         # Queue definitions
├── producers/      # Job publishers
└── workers/        # Result consumers
```

---

## Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** >= 6.0
- **Redis** >= 6.0
- **Problem Service** running (default: `http://localhost:3000`)
- **Socket Service** running (default: `http://localhost:3002`)

**Quick Verification:**

```bash
node --version && mongosh --eval "db.adminCommand('ping')" && redis-cli ping
```

---

## Installation

```bash
# Clone and install
git clone <repository-url>
cd Submission-Service
npm install

# Start the service
npm run dev  # Development with hot reload
npm start    # Production
```

---

## Configuration

Create `.env` file:

```env
PORT=3003
NODE_ENV=development

# Database
MONGODB_URL=mongodb://localhost:27017/algoforge_submissions

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# External Services
PROBLEM_SERVICE_URL=http://localhost:3000
SOCKET_SERVICE_BASE_URL=http://localhost:3002
```

---

## API Reference

### Health Check

```http
GET /api/v1/ping
```

### Create Submission

```http
POST /api/v1/submissions
Content-Type: application/json

{
  "userId": "user123",
  "problemId": "two-sum",
  "code": "def twoSum(nums, target):\n    return [0, 1]",
  "language": "python"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "createdSubmission": {
      "_id": "sub789",
      "userId": "user123",
      "problemId": "two-sum",
      "status": "Pending",
      "language": "python"
    },
    "queueResponse": { "id": "job123" }
  }
}
```

**Supported Languages:** `python`, `java`, `cpp`, `javascript`

---

## Database Schema

```javascript
{
  userId: String (required, indexed),
  problemId: String (required, indexed),
  code: String (required),
  language: Enum ['python', 'java', 'cpp', 'javascript'],
  status: Enum [
    'Pending',           // Initial state
    'Accepted',          // All tests passed
    'Wrong Answer',      // Output mismatch
    'Runtime Error',     // Execution exception
    'Compilation Error', // Build failed
    'Time Limit Exceeded',
    'Memory Limit Exceeded'
  ] (default: 'Pending', indexed)
}
```

**Indexes:**

- `{ userId: 1, createdAt: -1 }` - User submission history
- `{ problemId: 1, status: 1 }` - Problem analytics
- `{ status: 1, createdAt: -1 }` - Status filtering

---

## Code Stub Injection

Ensures consistent I/O handling for automated testing.

**Formula:** `Final Code = startSnippet + userCode + endSnippet`

**Example (Python):**

```python
# User Code
def square(n):
    return n * n

# After Injection
import sys  # startSnippet

def square(n):
    return n * n

if __name__ == '__main__':  # endSnippet
    print(square(int(input())))
```

Stubs are fetched from Problem Service based on `language` parameter.

---

## Queue System

### SubmissionQueue (Producer)

**Purpose:** Send code to Evaluator Service

**Payload:**

```javascript
{
  submissionId: "sub789",
  userId: "user123",
  code: "<injected-code>",
  language: "python",
  inputTestCases: ["5", "10"],
  outputTestCases: ["25", "100"]
}
```

### EvaluationQueue (Consumer)

**Purpose:** Receive execution results

**Payload:**

```javascript
{
  submissionId: "sub789",
  userId: "user123",
  status: "SUCCESS",  // or WRONG ANSWER, ERROR, TLE
  output: "25\n100"
}
```

**Status Mapping:**

- `SUCCESS` → `Accepted`
- `WRONG ANSWER` → `Wrong Answer`
- `ERROR` → `Runtime Error`
- `TLE` → `Time Limit Exceeded`

---

## Error Handling

| Code | Scenario | Response |
|------|----------|----------|
| 201 | Submission created | Success with submission ID |
| 400 | Invalid request body | `{ error: "Missing required fields" }` |
| 404 | Problem not found | `{ error: "Problem does not exist" }` |
| 500 | Database/Queue error | `{ error: "Internal server error" }` |
| 503 | Service unavailable | `{ error: "External service unreachable" }` |

---

## Troubleshooting

**Service won't start:**

```bash
# Check port availability
lsof -i :3003

# Verify dependent services
curl http://localhost:3000/api/v1/ping  # Problem Service
curl http://localhost:3002/ping          # Socket Service
```

**MongoDB connection failed:**

```bash
mongosh --eval "db.adminCommand('ping')"
# Check MONGODB_URL in .env
```

**Redis connection failed:**

```bash
redis-cli ping
# Verify REDIS_HOST and REDIS_PORT in .env
```

**Submissions stuck in "Pending":**

```bash
# Check queue depth
redis-cli LLEN bull:SubmissionQueue:wait

# Verify Evaluator Service is running
curl http://localhost:3001/ui  # Bull Board
```

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## License

ISC License

---

<p align="center">
  Made with ❤️ by <b>Krrish</b>
</p>
