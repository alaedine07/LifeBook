# LifeBook Backend

NestJS + TypeORM + SQLite backend for a journaling application.

---

## 🔧 Installation

```bash
npm install
```

---

## ▶️ Running the App

```bash
npm run start:dev
```

App runs at: `http://localhost:3000`

---

## 📦 API Endpoints

### 🔹 Reflections

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| GET    | `/reflections`     | Get all reflections |
| GET    | `/reflections/:id` | Get one reflection  |
| POST   | `/reflections`     | Create a reflection |
| PUT    | `/reflections/:id` | Update a reflection |
| DELETE | `/reflections/:id` | Delete a reflection |

**POST /reflections Body**

```json
{
  "content": "What are you grateful for today?"
}
```

**PUT /reflections/:id Body**

```json
{
  "content": "Updated reflection"
}
```

---

### 🔹 Day Entries

| Method | Endpoint                       | Description                 |
| ------ | ------------------------------ | --------------------------- |
| GET    | `/day-entries`                 | Get all day entries         |
| GET    | `/day-entries/:id`             | Get a specific day entry    |
| GET    | `/day-entries?date=YYYY-MM-DD` | Get entry by date           |
| POST   | `/day-entries`                 | Create a new day entry      |
| PUT    | `/day-entries/:id`             | Update a day entry          |
| DELETE | `/day-entries/:id`             | Delete a day entry          |
| POST   | `/day-entries/:id/answers`     | Add/update answers to entry |

**POST /day-entries Body**

```json
{
  "entryDate": "2025-06-03"
}
```

**PUT /day-entries/:id Body**

```json
{
  "entryDate": "2025-06-03"
}
```

**POST /day-entries/:id/answers Body**

```json
{
  "answers": {
    "reflectionId": "Your answer"
  }
}
```

---

## ⚙️ Notes

- `id` fields are UUIDs
- SQLite database stored locally
- `entryDate` format: `YYYY-MM-DD`
- Reflections are predefined questions
- Day entries link to reflections through answers
