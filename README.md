🏥 HealthConnect — Individual Assignment (Semester 7)
📘 Project Overview

HealthConnect is my individual project for Semester 7 at Fontys University of Applied Sciences.
The goal of this project is to design and develop a secure and scalable healthcare communication platform that connects patients, doctors, administrators, and pharmacies.

The project follows a microservices architecture, meaning each core component is built as a separate service. This allows independent development, deployment, and better scalability.

🏗️ System Structure

The system is divided into several repositories, each handling a specific function of the application.

🔹 Individual Service Repositories

admin-service

appointment-service

auth-service

doctor-service

patient-service

pharmacy-service

🔹 Main Repository (This One)

This main HealthConnect repository includes:

API Gateway – manages routing and communication between services

Web Client (UI) – front-end for end-users

Documentation – all project-related documents (architecture diagrams, reports, and progress documentation)

⚙️ Current Development Status

At this stage of development:

✅ The web client has been built and is functional.

⚙️ Some backend logic is implemented and still expanding.

🐳 All parts of the system are containerized using Docker.

🔄 Work is in progress to add CI/CD pipelines for automatic deployment and integration.

The current focus is on building a working proof-of-concept and ensuring all main services can communicate securely.

🩺 Planned Features

Not all features from the full system specification will be implemented for this assignment.
The selected main features to be demonstrated are listed below (see also the User Stories document for details):

👨‍🦱 Patient

Secure Login

Book Appointment

Request Prescription

👩‍⚕️ Doctor

Approve Prescription

💊 Pharmacy

View Prescriptions

These features represent the main interactions between users in the healthcare system.

🔐 Security and Data Protection

Security is a core part of the project design.
The system includes:

Token-based authentication and authorization

Encrypted communication between services (HTTPS)

GDPR-compliant handling of sensitive data

These measures ensure the protection of user and patient information across the system.

🚧 Ongoing Work

Development is still in progress.
The next steps include:

Completing the CI/CD setup for all repositories

Adding and testing backend functionality

Improving the front-end interface

Strengthening service-to-service communication security

📑 Documentation

All related documents are stored in this repository:

Architecture and design diagrams (C1, C2, C3)

Technical reports and implementation notes

Project documentation and progress updates

👤 Author

Name: Renis Hila
Institution: Fontys University of Applied Sciences
Course: HBO-ICT — Semester 7
Project: HealthConnect — Individual Assignment
