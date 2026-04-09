# Crewnect 🚀

Crewnect is a modern, student-centric networking application designed specifically for college campuses. It allows students to create structured profiles, highlight their major, current year of study, and technical interests to easily discover and connect with peers for projects, hackathons, or general collaboration!

## 🌟 Features
- **OTP Email Authentication:** Security first! Registration enforces domain-specific email addresses (e.g. `@delhitechnicalcampus.ac.in`) and uses Nodemailer to send a 6-digit confirmation OTP directly to the user's inbox.
- **JWT Session Management:** Employs secure, HTTP-only cookies storing encrypted JSON Web Tokens to easily maintain user sessions securely across the application.
- **Structured Tech Profiles:** Profile matching is simple through pre-defined toggleable tech stacks (Frontend, AI/ML, DevOps, UI/UX, etc.) and dropdown majors.
- **Live Directory Dashboard:** Instantly browse registered students with beautiful pill-shaped badge UI layouts.
- **Real-time Global Chat:** Powered by Socket.io, logged-in members can securely chat together instantly across the platform seamlessly.

## 🛠 Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Route Handlers (API), Node.js
- **Database**: SQLite with Prisma ORM
- **Security & Validation**: Zod (Schema validation), Bcryptjs (Password Hashing), Jose (JWT construction)
- **Email Delivery**: Nodemailer

---

## 💻 How to Clone and Run Locally
This repository is 100% ready for deployment or local execution! Follow these steps to spin it up in less than 5 minutes.

### 1. Clone the Repository
```bash
git clone https://github.com/md-nafish0007/Crewnect.git
cd Crewnect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
You will need to create a `.env` file at the root of the project to tell the app where your database and your email dispatcher are located. Create a `.env` and fill it out exactly like this:
```env
# Create your local database file
DATABASE_URL="file:./dev.db"

# The generic Google account acting as the automated postman
SMTP_EMAIL="your_developer_email@gmail.com"

# Generate an "App Password" strictly from Google Security Settings
SMTP_PASSWORD="xoxoxoxoxoxoxo"
```
*(If you do not add an App Password, the app will safely default to **Simulation Mode** and simply print the OTP token to your backend terminal logs instead of sending a real email.)*

### 4. Initialize Database
Running this command will physically create the `dev.db` SQLite file locally using the exact schema definitions we set up.
```bash
npx prisma db push
```
*(Optional: Run `npx prisma studio` to open a clean GUI to inspect your live database records!).*

### 5. Launch the Application!
```bash
npm run dev
```

Visit **`http://localhost:3000`** in your browser, register an account, enter your OTP, and explore the directory!
