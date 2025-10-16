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


🔹 These features represent the main interactions between users in the healthcare system.
- Services (each can live in a separate service)
- api-gateway (port 8080) — entry point, JWT verify, routes to services
- auth-service (3001) — register/login, issues JWTs
- patient-service (3002) — patient profiles + prescription requests
- doctor-service (3003) — review/approve/deny requests, manage schedule
- appointment-service (3004) — schedule/cancel appointments
- pharmacy-service (3005) — view approved prescriptions, mark dispensed
- admin-service (3006) — basic stats

🔹 The links to relevant git repo are:
- https://github.com/hilaRenis/HealthConnect_admin-service
- https://github.com/hilaRenis/HealthConnect_appointment-service
- https://github.com/hilaRenis/HealthConnect_auth-service
- https://github.com/hilaRenis/HealthConnect_doctor-service
- https://github.com/hilaRenis/HealthConnect_patient-service
- https://github.com/hilaRenis/HealthConnect_pharmacy-service