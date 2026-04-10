# Crewnect

Crewnect is a modern student networking platform designed for college campuses.

## Features
- **OTP Email Authentication:** Security first, validating college emails securely via Nodemailer.
- **JWT Session Management:** Employs secure, HTTP-only cookies storing JSON Web Tokens.
- **Structured Tech Profiles:** Profile matching via pre-defined toggleable tech stacks and majors.
- **Live Directory Dashboard:** Instantly browse registered students with beautiful pill UI layouts.
- **Real-time Global Chat:** Powered by Socket.io, logged-in members can securely chat.

## Installation
```bash
git clone https://github.com/md-nafish0007/Crewnect.git
cd Crewnect (to enter the folder)
npm install (to download all the node_modules dependencies)
Create the .env file and paste your exact database/email keys into it.
Run npx prisma generate & npx prisma db push (This step is crucial so Prisma configures itself to talk to your Neon database!)
npm run dev
```
