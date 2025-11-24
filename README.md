KineClinic - Angular 17 + Material - ZIP v4
-------------------------------------------
How to run:
1. unzip and cd into project folder
2. npm install
3. npx ng serve (or npm start) -> open http://localhost:4200

Notes:
- This scaffold includes feature modules for patients, appointments, sessions, prescriptions, staff and billing.
- Each feature has a MatTable list and a MatDialog Create/Edit form (reactive forms).
- Services use in-memory BehaviorSubject stores (replace with HttpClient for real API).
- If you get peer dependency errors, ensure Node >= 18 and npm >= 9, and that zone.js version is ^0.14.0 as included.
