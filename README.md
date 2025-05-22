📦 Backend Overview — TrackIt 
A Spring Boot backend for a Task and Habit Tracker app with secure authentication, analytics, and streak tracking. Built as a Semester 3 college mini-project.

✅ Features Implemented
🔐 User Module: Register/login with JWT auth and password hashing.

📋 Task Module: Add/update/delete tasks, repeat options, task history, completion tracking.

📆 Habit Module: Create/log habits, view weekly progress and streaks.

📊 Analytics Module: Completion stats, best/worst days, habit consistency.

🧱 Project Structure with Explanations
config/
SecurityConfig: Configures Spring Security, JWT filters, and endpoint protection.

controller/
UserController: Manages registration, login, and user profile operations.

TaskController: Handles task creation, editing, deletion, and completion.

HabitController: Handles creation and listing of habits.

HabitLogController: Logs habit completion and fetches user habit progress.

AnalyticsController: Returns summary statistics and performance insights.

dto/
LoginRequest: DTO for user login credentials (email & password).

TaskRequest: DTO for sending task data (title, due date, priority, repeat, etc.).

exception/
UserNotFoundException: Thrown when user is not found in the DB.

ResourceNotFoundException: Thrown for missing tasks, habits, etc.

model/
User: Represents registered users.

Task: Represents to-do items with due date and repeat configuration.

Habit: Represents repeatable daily/weekly habits.

HabitLog: Tracks when users complete a habit entry.

Priority: Enum to define task priority (Low, Medium, High).

RepeatType: Enum for repeat logic (None, Daily, Weekly).

repository/
UserRepository: JPA interface for user DB operations.

TaskRepository: Interface to interact with tasks in DB.

HabitRepository: Interface for habit CRUD operations.

HabitLogRepository: Handles storing/logging user habit completions.

security/
CustomUserDetails: Wraps user data for Spring Security.

CustomUserDetailsService: Loads user from DB for authentication.

JwtAuthenticationFilter: Authenticates login requests using JWT.

JwtFilter: Secures API endpoints by verifying token on each request.

JwtUtil: Utility for generating and parsing JWT tokens.

service/
UserService: Contains user-related business logic (register, login, etc.).

TaskService: Handles business logic for all task operations.

HabitService: Processes habit CRUD and frequency logic.

HabitLogService: Tracks streaks and manages habit logging.

TrackitApplication.java
The Spring Boot application entry point (runs your backend).

⚙️ Resources
application.properties: Configures DB, JWT secret, server port, etc.

static/, templates/: Reserved folders (currently unused for frontend/templates).

🛠️ Tech Stack
Spring Boot, Spring Security, JWT, JPA/Hibernate

MySQL / H2 (DB assumed)

Maven/Gradle (build tool assumed)

🚀 Ready for Frontend
This backend is now production-ready for integration with a frontend (React/Next.js suggested). All core modules and features are implemented and structured cleanly.
