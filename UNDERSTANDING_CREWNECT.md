# Complete Crewnect Project Understanding Guide

This document maps out precisely how your project is architected so that you can understand the inner workings of every major module!

## 1. The Core Architecture
Crewnect is built on a **Full-Stack Next.js (App Router)** setup. This means both your glowing UI and your secure Backend APIs live in the same repository, allowing them to communicate flawlessly.

- **Frontend:** Written in React using Tailwind CSS for that stunning, ultra-modern styling you see on the dashboard.
- **Backend:** Native Next.js API Routes (`src/app/api/...`) act as your server engine.
- **Database:** Prisma ORM connected to a simple, local `dev.db` (SQLite). Prisma makes database relationships readable and secure without having to write naked SQL queries.

## 2. Authentication Flow (How a User Registers)
1. **The Modal:** A user clicks "Register" and fills out their Name, Major, Year, Tech Stacks, and crucially, their College Email (`@delhitechnicalcampus.ac.in`).
2. **OTP Generation:** The frontend hits `/api/send-otp`. Your backend receives this, generates a temporary 6-digit code, saves it to the Prisma Database (so it has an expiration timer), and utilizes the `.env` `SMTP_EMAIL` credentials via **Nodemailer** to email that code to the user.
3. **Verification:** The user types that OTP into the second screen. The frontend submits all their profile data + the OTP to `/api/register`.
4. **Account Creation:** The backend cross-references the OTP with the database. If it matches, it hashes their password using **Bcrypt** for security, deletes the temporary OTP, and permanently creates their `Student` row in the database.
5. **Session Initiation:** The backend issues a **JWT (JSON Web Token)** through the `jose` encryption library, sticking it into an `HttpOnly` cookie in the user's browser. Now, the user is fundamentally logged in!

## 3. Directory Dashboard
When a user is successfully logged in, the homepage conditional logic flips. You no longer see the giant "Register" banners; instead, the `Directory` component boots up.
- The platform queries all `Student` rows natively through `prisma.student.findMany()`.
- It loops through those students and dynamically renders your custom `UserCard` layouts, splitting out their beautifully colored Tech Stack tags and Major.

## 4. Real-time Global Chat
At the bottom right corner lives the chat system!
- **Socket.io** handles the persistent, instant connection. When the server (`server.js`) spins up, it hooks into Next.js and listens for messages.
- The Chat Box verifies if a user is logged in (via their current JWT session cookie). If they are, it allows them to type. When they hit send, the message blasts to `server.js`, and `server.js` identically blasts that message back out to every other actively connected browser in the world instantly!

## What you are learning by building this:
By working on Crewnect, you are effectively mastering the industry standards of:
- Building robust Data Models with Prisma.
- Executing Two-Factor Authentication (2FA/OTP) securely.
- Maintaining encrypted JWT sessions.
- Constructing beautiful, micro-animated user interfaces.
