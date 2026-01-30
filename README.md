# 💰 ExpenseTracker

A full-stack expense tracking application with authentication, analytics, reporting, and admin insights.

---

## 🚀 Features

* User Registration & Login (JWT Authentication)
* Add / Update / Delete Expenses
* Personal Dashboard with Charts
* Reports with PDF Export
* AI Spending Insights (basic rule-based)

---

## 🛠 Tech Stack

### Frontend

* React
* Material UI (MUI)
* Recharts
* Axios
* jsPDF + jspdf-autotable

### Backend

* Spring Boot
* Spring Security + JWT
* Spring Data JPA
* MySQL

---

## 📁 Project Structure

```
expense_track/
│
├── backend/                     # Spring Boot API
│   ├── src/main/java/com/expensetracker
│   │   ├── controller/          # REST Controllers
│   │   ├── entity/              # JPA Entities
│   │   ├── repository/          # JPA Repositories
│   │   ├── security/            # JWT & Security Config
│   │   └── ExpenseTrackerApplication.java
│   │
│   ├── src/main/resources
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/                    # React App
    ├── src/Pages/               # App Pages
    ├── src/Components/          # UI Components & Layout
    ├── src/context/             # Auth Context
    ├── src/utils/               # Helper Functions
    ├── src/api.js               # Axios Config
    └── package.json
```

---

## Backend Setup (Spring Boot)

### 1️⃣ Configure MySQL

Edit:

```
backend/src/main/resources/application.properties
```

Example:

```
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

### 2️⃣ Run Backend

```
cd backend
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

## Frontend Setup (React)

### 1️⃣ Install dependencies

```
cd frontend
npm install
```

### 2️⃣ Start frontend

```
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login user        |

---

### Expenses

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | /api/expenses      | Get user expenses |
| POST   | /api/expenses      | Add expense       |
| PUT    | /api/expenses/{id} | Update expense    |
| DELETE | /api/expenses/{id} | Delete expense    |

---

### Users

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | /api/users/me  | Current logged user |
| GET    | /api/users/all | All users (admin)   |

---

## Reports & PDF

* User Expense PDF Export (Reports page)

> Note: `₹` is replaced with `Rs.` in PDFs to avoid encoding issues.

---

## Notes

* JWT token stored in `localStorage`
* Unauthorized users redirected to login
* Each expense belongs to authenticated user only
* Fully responsive modern UI

---
Frontend deploy: https://trackingexpens.netlify.app/
Backend: https://expensetrack-production-7464.up.railway.app/
Database: Connected and running (Railway) 
