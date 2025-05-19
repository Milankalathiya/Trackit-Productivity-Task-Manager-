#Trackit-Productivity-Task-Manager-

A Spring Boot backend for managing user tasks with JWT-based authentication, task scheduling, and repeatable task logic.

🚀 TrackIt Backend
This is the backend service for TrackIt, a task management application built with Spring Boot. It provides a set of secure and well-structured REST APIs for:

🔐 User registration and login using JWT authentication

✅ Task creation, completion, update, and deletion

📅 Daily and historical task listing with repeat logic

🔎 Task history filtering by custom date ranges

🛡️ Secure access to endpoints via token-based authorization

✅ Features
JWT-based Authentication: Secure login and user identification.

Task Management:

✅ Create Task (supports due date, priority, repeat type)

📋 View All Tasks (mapped to the logged-in user)

📅 View Today’s Tasks (includes tasks with repeat logic)

🔄 View Task History (filter by custom date ranges)

☑️ Mark Task as Complete

🗑️ Delete Task

✏️ Update Task

Robust API Design: Clean and RESTful structure for easy integration with any frontend.

🧰 Tech Stack
Java 17+

Spring Boot

Spring Security

JWT (via jjwt)

Database: MySQL
