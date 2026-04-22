# LifeBook - Functional Specification

## 1. Overview

**LifeBook** is a digital mental health and wellness platform that enables users to track their emotional well-being through mood logging and reflective journaling. The platform facilitates a patient-therapist relationship, allowing healthcare professionals to monitor their patients' mental health data and provide supportive feedback through comments.

**Target Users:**
- **Patients**: Individuals seeking to track and improve their mental health
- **Therapists**: Licensed mental health professionals monitoring patient progress

---

## 2. Core Features

### 2.1 Authentication & Authorization

**User Roles:**
- `USER`: Patient role - can track moods/reflections and view therapist feedback
- `THERAPIST`: Therapist role - can view assigned patients' data and provide comments

**Authentication Flow:**
1. Users register with email and password
2. Users login to receive JWT authentication token
3. All subsequent requests require valid JWT token (Bearer token)
4. JWT strategy validates token on protected routes

**Endpoints:**
- `POST /auth/register` - Register new user (USER role by default)
- `POST /auth/login` - Login and receive JWT token

---

### 2.2 Mood Tracking

**Purpose:** Allow users to log their emotional state with optional notes.

**Data Model:**
```
Mood {
  id: integer
  userId: integer (foreign key to User)
  date: DateTime
  moodType: HAPPY | SAD | NEUTRAL | EXTREMELY_HAPPY | EXTREMELY_SAD | ANXIOUS | TIRED | EXCITED | ANGRY
  note: string (optional)
}
```

**User Flows:**

*Patient - Create Mood Entry:*
1. Patient navigates to mood tracking section
2. Selects mood type from predefined emoji list (MOOD_EMOJIS constants)
3. Optionally adds a text note
4. Submits mood entry for today
5. Entry is stored with current timestamp

*Patient - View/Edit Mood History:*
1. Patient can view moods for a specific date
2. Patient can update existing mood entries
3. Patient can delete mood entries

*Therapist - View Patient Moods:*
1. Therapist views assigned patient's data for a selected date
2. Can see all mood entries with timestamps
3. Can add comments to specific mood entries

**Endpoints:**
- `POST /moods` - Create mood entry
- `PUT /moods/:id` - Update existing mood entry
- `DELETE /moods/:id` - Delete mood entry
- `GET /moods/:date` - Get moods for specific date

---

### 2.3 Reflections & Daily Answers

**Purpose:** Enable users to set up reflection questions and track daily responses for ongoing self-assessment.

**Reflection Types:**
- `BOOLEAN`: Yes/No questions
- `NUMBER`: Numeric scale responses (e.g., 1-10 ratings)
- `TEXT`: Open-ended text responses

**Data Model:**
```
Reflection {
  id: integer
  userId: integer
  question: string
  type: BOOLEAN | NUMBER | TEXT
}

DailyAnswer {
  id: integer
  userId: integer
  reflectionId: integer (foreign key)
  date: DateTime
  booleanAnswer: boolean (optional)
  numberAnswer: float (optional)
  textAnswer: string (optional)
}
```

**User Flows:**

*Patient - Create Reflection Question:*
1. Patient sets up a new reflection question
2. Selects question type (Boolean, Number, or Text)
3. Saves question to profile

*Patient - Answer Daily Reflection:*
1. Patient views assigned reflections for today
2. Provides answer based on reflection type
3. Answers are timestamped for tracking
4. Can update answers if not yet finalized

*Patient - View Answer History:*
1. Patient can retrieve answers for a specific date
2. Can see progression of responses over time

*Therapist - View Patient Answers:*
1. Can see patient's daily answers and reflection responses
2. Can track patient's progress on key metrics

**Endpoints:**
- `POST /reflections` - Create reflection question
- `GET /reflections` - List all reflections for user
- `PUT /reflections/:id` - Update reflection question
- `DELETE /reflections/:id` - Delete reflection question
- `POST /daily-answers` - Submit daily answer to reflection
- `PUT /daily-answers/:id` - Update daily answer
- `GET /daily-answers/:date` - Get all answers for specific date

---

### 2.4 Therapist-Patient Relationship

**Purpose:** Establish and manage connections between therapists and their patients.

**Data Model:**
```
UserTherapist {
  id: integer
  userId: integer (patient)
  therapistId: integer (therapist)
  createdAt: DateTime
}
```

**User Flows:**

*Therapist - Add Patient:*
1. Therapist provides patient email address
2. System creates relationship linking therapist to patient
3. Patient is now assigned to therapist

*Therapist - View Assigned Patients:*
1. Therapist can see list of all assigned patients
2. Can select patient to view their data

*Patient - View Assigned Therapists:*
1. Patient can see list of therapists assigned to them
2. Can remove therapist from their care team

*Therapist - View Patient Data for Specific Date:*
1. Therapist selects patient and date
2. System returns:
   - All mood entries for that date
   - All daily answers/reflections for that date
   - Existing comments on those entries

**Endpoints:**
- `POST /therapists/add` - Add patient (therapist provides patient email)
- `GET /therapists/patients` - Get list of assigned patients
- `GET /therapists/patient/:patientId/data/:date` - Get patient data for specific date
- `GET /therapists/my-therapists` - Get therapists assigned to current user
- `DELETE /therapists/remove/:therapistId` - Remove therapist from care team

---

### 2.5 Comments & Feedback

**Purpose:** Enable therapists to provide supportive feedback on patient entries.

**Comment Types:**

1. **Mood Comments** - Feedback on specific mood entries
2. **Reflection Comments** - Feedback on specific daily answers

**Data Models:**
```
MoodComment {
  id: integer
  moodId: integer (foreign key)
  therapistId: integer (foreign key)
  comment: string
  createdAt: DateTime
}

ReflectionComment {
  id: integer
  DailyAnswerId: integer (foreign key)
  therapistId: integer (foreign key)
  comment: string
  createdAt: DateTime
}
```

**User Flows:**

*Therapist - Add Comment to Mood Entry:*
1. Therapist views patient's mood entry
2. Types supportive or analytical comment
3. Submits comment tied to mood entry
4. Comment is timestamped and attributed to therapist

*Therapist - Add Comment to Reflection Answer:*
1. Therapist views patient's daily answer
2. Types feedback or encouragement
3. Submits comment to specific daily answer
4. Patient can see comment when viewing their data

*Patient - View Comments:*
1. Patient can see all comments from therapists
2. Comments appear alongside corresponding entries
3. Shows therapist name and comment timestamp

*Therapist - Manage Comments:*
1. Can edit own comments
2. Can delete own comments
3. Can view all comments they've made

**Endpoints:**
- `POST /therapists/mood-comments` - Add comment to mood
- `PUT /therapists/mood-comments/:id` - Update mood comment
- `DELETE /therapists/mood-comments/:id` - Delete mood comment
- `POST /therapists/reflection-comments` - Add comment to reflection answer
- `PUT /therapists/reflection-comments/:id` - Update reflection comment
- `DELETE /therapists/reflection-comments/:id` - Delete reflection comment

---

### 2.6 User Management

**Purpose:** Handle user profile and account operations.

**User Flows:**

*User - View Profile:*
1. User can access their profile information
2. See email, username, created date
3. View role (PATIENT or THERAPIST)

**Endpoints:**
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user profile by ID

---

## 3. Technical Architecture

### 3.1 Backend Stack
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Style**: RESTful
- **Containerization**: Docker

### 3.2 Frontend Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (for auth)
- **Data Fetching**: Custom hooks with API integration
- **Containerization**: Docker + Nginx

---

## 4. Data Flow Diagrams

### 4.1 Patient Mood Entry Flow
```
Patient → Create Mood Entry → Backend API → Validate & Store in DB → Return Confirmation → UI Update
```

### 4.2 Therapist Comment Flow
```
Therapist → View Patient Data → Select Entry → Add Comment → Backend API → Store Comment & Link to Entry → Return Data → Both Users See Comment
```

### 4.3 Daily Reflection Answer Flow
```
Patient → View Reflections → Select Question → Answer Question → Backend API → Store Answer with Type → Return Confirmation → UI Update
```

---

## 5. User Roles & Permissions

### 5.1 Patient (USER Role)
**Allowed Actions:**
- ✅ Register and login
- ✅ Create mood entries
- ✅ Edit/delete own mood entries
- ✅ View own mood history
- ✅ Create reflection questions
- ✅ Answer daily reflections
- ✅ Edit/update own answers
- ✅ View own answers
- ✅ View assigned therapists
- ✅ Remove therapist from care team
- ✅ View therapist comments
- ❌ Cannot view other patients' data
- ❌ Cannot comment on entries
- ❌ Cannot add patients

### 5.2 Therapist (THERAPIST Role)
**Allowed Actions:**
- ✅ Register and login
- ✅ Add patients by email
- ✅ View list of assigned patients
- ✅ View patient data for specific dates
- ✅ Add comments to patient mood entries
- ✅ Add comments to patient reflection answers
- ✅ Edit/delete own comments
- ✅ View all patients' mood and reflection data
- ✅ View patient list
- ✅ Remove patient from care team
- ❌ Cannot create mood/reflection entries
- ❌ Cannot modify patient data
- ❌ Cannot view other therapists' patient lists

---

## 6. Frontend UI Components & Pages

### 6.1 Authentication Pages
- **Login Page**: Email and password entry with forgotten password option
- **Register Page**: Name, email, password, role selection

### 6.2 Patient Dashboard
- **Mood Tracker**: Create/view mood entries with emoji selector
- **Reflections**: Set up and answer reflection questions
- **History**: View past mood and answer entries
- **Therapists**: View assigned therapists and manage relationships

### 6.3 Therapist Dashboard
- **Patient List**: Browse and select patients
- **Patient Detail**: View patient's mood and reflection data for selected date
- **Comment Section**: Add, edit, delete comments on entries
- **Data Timeline**: Historical view of patient's entries

### 6.4 Shared Components
- **CommentSection**: Reusable component for viewing and adding comments
- **Layout**: Navigation, header, sidebar

---

## 7. API Response Format

### 7.1 Success Response
```json
{
  "id": 123,
  "userId": 1,
  "moodType": "HAPPY",
  "note": "Had a great day!",
  "date": "2026-04-03T10:30:00Z"
}
```

### 7.2 Error Response
```json
{
  "statusCode": 400,
  "message": "Invalid mood type",
  "error": "Bad Request"
}
```

### 7.3 Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

## 8. Security Considerations

- **Authentication**: JWT tokens with Bearer scheme
- **Authorization**: Guards on all protected endpoints enforce role-based access
- **Password**: Hashed in database (implementation in auth service)
- **Data Isolation**: Users can only access their own data; therapists can only access assigned patients
- **Cascading Deletes**: Related data cleaned up when user accounts are deleted
- **CORS**: Configure for frontend domain in production

---

## 9. Future Enhancements

- [ ] Mood trend analytics and visualization
- [ ] Progress reports for therapists
- [ ] Export patient data to PDF
- [ ] Video consultation integration
- [ ] Mobile app
- [ ] Real-time notifications for new patient data
- [ ] Medication tracking
- [ ] Sleep and exercise logging
- [ ] AI-powered mood insights
- [ ] Multi-language support

---

## 10. Testing Requirements

### 10.1 Backend Unit Tests
- Authentication service (register, login, JWT validation)
- Mood service (CRUD operations, authorization)
- Reflection service (CRUD operations)
- Daily answer service (creation, updates)
- Comment service (creation, validation)
- Therapist service (patient assignment, data retrieval)

### 10.2 Integration Tests
- End-to-end authentication flow
- Patient creating mood and therapist commenting
- Data isolation between users
- Date-based queries

### 10.3 Frontend Tests
- Component rendering (PatientDetail, CommentSection)
- Custom hooks (useAuth, useMoods, useTherapists)
- Form submissions
- Comment creation and deletion
- Date filtering

---

## 11. Deployment

**Docker Compose Setup:**
- PostgreSQL database container
- Backend NestJS API container
- Frontend React/Nginx container
- Network isolation and volume management

**Environment Variables:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing
- `API_URL`: Backend API endpoint for frontend

---

## Document Version

- **Version**: 1.0
- **Last Updated**: April 3, 2026
- **Status**: Complete
