
## Capstone Project Proposal

### Project Title
**Clinic Dashboard — React + Vite + Supabase + Google Cloud**

### Project Overview
The Clinic Dashboard is a modern, responsive web application designed to **streamline patient management, staff scheduling, and appointment tracking** for healthcare facilities. Leveraging **React** with **Vite** for fast development, **Supabase** for a robust backend, and **Google Cloud** for secure authentication, this project demonstrates a professional, scalable solution for real-world clinic operations.

The system provides a **single source of truth** for administrators, doctors, and staff, enabling efficient clinic management and minimizing errors associated with manual record-keeping.

### Motivation
Many healthcare facilities struggle with fragmented or paper-based management of patients and staff. This project provides a **centralized digital solution** that is:

- **Efficient:** Real-time access to patient and staff data  
- **Scalable:** Extendable for multiple clinics or departments  
- **User-friendly:** Intuitive, responsive UI for desktops and tablets  
- **Secure:** Authentication with Google OAuth and Supabase security features  

### Objectives
1. Build a **user-friendly dashboard** displaying critical clinic information at a glance.  
2. Enable **patient management** with creation, update, and history tracking.  
3. Implement **staff management**, including role assignments, specializations, and availability.  
4. Support **appointment scheduling** with real-time availability checks.  
5. Ensure **data integrity** through properly structured database tables and foreign key relationships.  
6. Showcase modern web technologies (**React, Supabase, Google Cloud**) in a practical healthcare application.  

### Expected Outcomes
- A **fully functional clinic management dashboard**  
- Demonstrated proficiency with **modern frontend and backend technologies**  
- A foundation for **future enhancements** such as AI-assisted patient triage, analytics dashboards, or mobile support  

---

## Table of Contents
1. [Tech Stack](#tech-stack)  
2. [Database Schema](#database-schema)  
3. [Features](#features)  
4. [Prerequisites](#prerequisites)  
5. [Setup and Installation](#setup-and-installation)  
6. [Project Structure](#project-structure)  
7. [Scripts](#scripts)  
8. [Google Cloud Integration](#google-cloud-integration)  
9. [Development Tips](#development-tips)  
10. [License](#license)  

---

## Tech Stack

- **Frontend:** React + Vite  
- **Backend/Database:** Supabase (PostgreSQL)  
- **Authentication & API:** Google Cloud OAuth  
- **Styling:** Tailwind CSS / utility-first classes  
- **Icons:** lucide-react  
- **Language:** JavaScript  

---

## Database Schema

The application uses **five main tables** with nested foreign key relationships:

### 1. `user`
- `id` (PK)  
- `full_name`  
- `email`  
- `password` (hashed)  
- `role` (admin/staff)  
- `created_at`  

### 2. `patient`
- `id` (PK)  
- `full_name`  
- `gender`  
- `date_of_birth`  
- `contact`  
- `address`  
- `created_by` (FK → `user.id`)  
- `created_at`  

### 3. `staff`
- `id` (PK)  
- `full_name`  
- `role`  
- `specialization_id` (FK → `specialization.id`)  
- `contact`  
- `created_by` (FK → `user.id`)  
- `created_at`  

### 4. `specialization`
- `id` (PK)  
- `name` (e.g., cardiology, pediatrics)  
- `description`  

### 5. `appointment`
- `id` (PK)  
- `patient_id` (FK → `patient.id`)  
- `staff_id` (FK → `staff.id`)  
- `date`  
- `time`  
- `status` (pending, confirmed, completed, cancelled)  

### 6. `staff_availability`
- `id` (PK)  
- `staff_id` (FK → `staff.id`)  
- `day_of_week`  
- `start_time`  
- `end_time`  

---

## Features

- User authentication with **Supabase + Google OAuth**  
- Patient management (create, edit, view, delete)  
- Staff management with specializations and availability tracking  
- Appointment scheduling with status management  
- Nested database relationships for data integrity  
- Responsive and interactive dashboard  
- Modular React components for maintainability  

---

## Prerequisites

- Node.js 18+  
- npm 
- Supabase project with database tables configured  
- Google Cloud project with OAuth credentials  

---

## Setup and Installation

1. **Clone the repository**
```bash
git clone [repo-url]
cd clinicpro
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**  
Create a `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```



---

## Project Structure

```
.vscode/
node_modules/
public/
src/
 ├─ assets/
 │   ├─ hero-hospital.png
 │   ├─ react.svg
 │   └─ theme.css
 ├─ components/
 │   ├─ appointments/
 │   ├─ auth/
 │   ├─ calender/
 │   ├─ dashboard/
 │   ├─ layout/
 │   ├─ patients/
 │   ├─ settings/
 │   ├─ ui/
 │   └─ other UI components (header, footer, hero, services)
 ├─ context/
 │   ├─ AuthContext.jsx
 │   └─ ThemeContext.jsx
 ├─ lib/
 │   ├─ constants.js
 │   └─ supabaseClient.js
 ├─ pages/
 │   ├─ dashboard/
 │   ├─ landing/
 │   ├─ login/
 │   └─ register/
 ├─ App.css
 ├─ App.jsx
 ├─ index.css
 └─ main.jsx
.env
.gitignore
eslint.config.js
index.html
package.json
package-lock.json
README.md
vite.config.js
```

---

## Scripts


| `npm run dev` | Start development server with HMR |
| `npm run build` | Build production bundle |


---

## Google Cloud Integration

- Enable OAuth credentials in **Google Cloud Console**  
- Use client ID and secret in `.env`  
- Connect with **Supabase auth** for Google login  

---

## Development Tips

- Keep components **small and reusable**  
- Centralize Tailwind **design tokens**  
- Use **Supabase hooks** for reactive data fetching  
- Test foreign key relationships carefully  
- Modular dashboard widgets (`summary-card`, `recent-activity`) improve maintainability  

---



## License

Specify a license (e.g., MIT) in LICENSE file  

