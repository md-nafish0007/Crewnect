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
cd Crewnect
npm install
npx prisma db push
npm run dev
```
