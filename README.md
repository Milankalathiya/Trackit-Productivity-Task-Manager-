📦 TrackIt - Task and Habit Tracker (Mini Project)
TrackIt is a full-stack Task and Habit Tracker application developed as a Semester 3 college mini-project. It consists of a Spring Boot backend with secure user authentication, task management, habit tracking, and analytics, paired with a frontend for user interaction. The main branch combines both backend and frontend for a complete application.

✅ Project Overview
TrackIt helps users organize tasks and track habits with a user-friendly interface. The backend provides a secure REST API, while the frontend offers intuitive navigation for registration, login, and dashboard access.

Features
User Management: Register and log in securely with JWT authentication.
Task Management: Create, update, delete, and mark tasks as complete with due dates and priorities.
Habit Tracking: Log daily/weekly habits and monitor streaks.
Analytics: View task completion stats and habit progress.
Navigation: Smooth dashboard experience with browser history handling to prevent unauthorized access to login/register pages after authentication.

🧱 Project Structure
The main branch integrates the backend and frontend codebases:

Backend (backend/)
Core Components:
config/: Security and JWT setup.
controller/: Handles API requests for users, tasks, habits, and analytics.
model/: Defines data structures (User, Task, Habit, etc.).
service/: Business logic for tasks, habits, and user operations.
repository/: Database interactions using JPA.
security/: JWT authentication and user security logic.
TrackitApplication.java: Spring Boot entry point.
resources/application.properties: Configures database and server settings.
Frontend (frontend/)
Core Components:
src/pages/: Login, registration, and dashboard pages.
src/components/: Reusable UI elements (e.g., task cards, navigation bar).
src/utils/: API call utilities and history management.
public/: Static assets (e.g., images).
Branch Structure
main: Combines backend and frontend for the full application.
backend: Contains only the Spring Boot backend code.
frontend: Contains only the React/Next.js frontend code.

🛠️ Tech Stack
Backend:
Spring Boot (REST API)
Spring Security (JWT authentication)
JPA/Hibernate (database operations)
MySQL/H2 (database)
Maven/Gradle (build tool)
Frontend:
React/Next.js (user interface)
JavaScript/TypeScript (frontend logic)
CSS/Tailwind CSS (styling)
Axios/Fetch (API requests)

🚀 How to Run
Prerequisites
Backend: Java 17+, Maven/Gradle, MySQL (or H2 for testing).
Frontend: Node.js 16+, npm/Yarn.

Git: To clone the repository.
Steps
Clone the Repository:
bash

git clone https://github.com/your-username/your-repo.git
cd your-repo
Run the Backend:
Navigate to backend/:
bash

cd backend
Configure application.properties (e.g., database URL, JWT secret).
Build and run:
bash

mvn clean install  # Or: gradle build
java -jar target/trackit.jar  # Or: mvn spring-boot:run
Backend runs at http://localhost:8080.
Run the Frontend:
Navigate to frontend/:
bash

cd frontend
Install dependencies:
bash

npm install  # Or: yarn install
Start the frontend:
bash

npm run dev  # Or: yarn dev
Frontend runs at http://localhost:3000.
Access the App:
Open http://localhost:3000 in your browser.
Register, log in, and use the dashboard to manage tasks and habits.
📝 Notes
The backend uses a MySQL database (create trackit_db) or H2 for testing.
The frontend prevents back navigation to login/register pages after authentication.
The main branch merges backend and frontend branches. To update main:
bash

git checkout main
git merge backend
git merge frontend
🙌 Contributions
This is a college mini-project, but suggestions or improvements are welcome! Contact the team for collaboration.
