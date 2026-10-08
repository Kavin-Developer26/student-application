# Full Stack Student Registration System (Spring Boot + H2 + Thymeleaf / Standalone Frontend)

A complete full-stack web application featuring **Spring Boot 3**, **Jakarta Bean Validation**, **Spring Data JPA**, **Embedded H2 Database**, **Thymeleaf**, and a modern, responsive **Standalone Frontend**.

---

## 📁 Project Structure

```
accord-project/
├── backend/                               # Spring Boot Backend
│   ├── pom.xml                            # Maven dependencies (Web, Thymeleaf, Validation, JPA, H2)
│   ├── mvnw & mvnw.cmd                    # Maven wrapper
│   └── src/main/
│       ├── java/com/example/demo/
│       │   ├── DemoApplication.java       # Spring Boot main class
│       │   ├── model/
│       │   │   └── Student.java           # JPA Entity with Jakarta Validation rules
│       │   ├── repository/
│       │   │   └── StudentRepository.java # Spring Data JPA repository
│       │   ├── service/
│       │   │   └── StudentService.java    # Persistence business logic
│       │   ├── controller/
│       │   │   ├── StudentController.java # Thymeleaf MVC routing & form validation
│       │   │   └── StudentApiController.java # REST API endpoints for frontend
│       │   └── config/
│       │       └── WebConfig.java         # CORS & web configuration
│       └── resources/
│           ├── application.properties     # H2 DB config & console settings
│           ├── static/
│           │   └── layout.css             # Dark modern design stylesheet
│           └── templates/
│               ├── register.html          # Thymeleaf registration form with error feedback
│               ├── success.html           # Thymeleaf success confirmation
│               └── students.html          # Database directory table
├── frontend/                              # Standalone Modern Frontend
│   ├── index.html                         # Portal landing page
│   ├── register.html                      # Registration form with live validation & API submit
│   ├── success.html                       # Submission confirmation screen
│   ├── students.html                      # Live Student Directory with search & delete
│   ├── css/
│   │   └── style.css                      # Modern dark theme with glassmorphism & animations
│   └── js/
│       ├── app.js                         # Real-time regex validation & REST API fetch
│       └── students.js                    # Live database table rendering & filtering
├── pom.xml                                # Root aggregator Maven POM
├── run-backend.sh                         # One-click startup script for backend
└── README.md                              # Project documentation
```

---

## 🛡️ Validation Rules (Jakarta Validation in `Student.java`)

| Field | Jakarta Validation Annotations | Enforced Condition | Error Message |
| :--- | :--- | :--- | :--- |
| **`name`** | `@Pattern(regexp="^[a-zA-Z ]{3,20}$")` | 3 to 20 letters and spaces | *Invalid Name (3-20 letters required)* |
| **`email`** | `@NotBlank`, `@Email` | Not empty, valid email pattern | *Please enter Email-ID* / *Invalid Email* |
| **`phone`** | `@Min(6000000000L)`, `@Max(9999999999L)` | 10-digit number starting with 6–9 | *Invalid Phone Number (Must be 10 digits)* |
| **`dob`** | `@NotNull`, `@PastOrPresent` | Non-null, past or today's date | *Please enter DOB* / *Please enter valid date* |
| **`age`** | `@Min(18)`, `@Max(100)` | Integer between 18 and 100 | *Minimum age is 18* / *Maximum age is 100* |

---

## 🗄️ Database: Embedded H2 Database

The project is preconfigured with **H2 Database**, which requires **zero external installation or setup**.

* **Database Mode**: Persistent file-based (records saved in `./backend/data/studentdb`)
* **Console URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
* **JDBC URL**: `jdbc:h2:file:./data/studentdb;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE`
* **Username**: `sa`
* **Password**: *(leave blank)*
* **Table**: Auto-generated `STUDENTS` table via Hibernate (`ddl-auto=update`)

> **Switching to MySQL (Optional):**
> If you wish to use MySQL later, simply open `backend/src/main/resources/application.properties` and uncomment the MySQL section while adding the `mysql-connector-j` dependency in `backend/pom.xml`.

---

## 🚀 How to Run

### Method 1: Run with IntelliJ IDEA (Recommended)
1. Open IntelliJ IDEA.
2. Choose **Open** and select `/Users/apple/Desktop/accord project` (or `/backend`).
3. IntelliJ will automatically detect Maven and import the dependencies.
4. Navigate to `backend/src/main/java/com/example/demo/DemoApplication.java`.
5. Right-click and choose **Run 'DemoApplication'**.

### Method 2: Run via Terminal
From the project root:
```bash
./run-backend.sh
```
Or inside `backend`:
```bash
cd backend
./mvnw spring-boot:run
```

---

## 🌐 Accessing the Application

Once the Spring Boot application is running:

### 1. Thymeleaf MVC Web Pages (Server-Side)
* **Registration Form**: [http://localhost:8080/register](http://localhost:8080/register)
* **Student Directory**: [http://localhost:8080/view-students](http://localhost:8080/view-students)
* **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

### 2. Standalone Frontend (Client-Side)
Simply open any of the HTML files in `frontend/` in your browser (e.g. Double-click or open with browser):
* **Portal Home**: [frontend/index.html](file:///Users/apple/Desktop/accord%20project/frontend/index.html)
* **Registration Page**: [frontend/register.html](file:///Users/apple/Desktop/accord%20project/frontend/register.html)
* **Live Student Directory**: [frontend/students.html](file:///Users/apple/Desktop/accord%20project/frontend/students.html)

---

## 🔌 REST API Endpoints

The backend provides a RESTful API with CORS enabled at `http://localhost:8080/api/students`:
* `GET /api/students` — Retrieve all students
* `GET /api/students/{id}` — Retrieve single student by ID
* `POST /api/students` — Register a student (with JSON validation & field-level error responses)
* `DELETE /api/students/{id}` — Delete a student by ID
# student-application
