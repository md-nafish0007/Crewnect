import nodemailer from "nodemailer";

const SMTP_EMAIL = process.env.SMTP_EMAIL || "";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    console.warn("SMTP_EMAIL or SMTP_PASSWORD is not set. Simulating OTP email send.");
    console.log(`[SIMULATED EMAIL] To: ${to} | OTP: ${otp}`);
    return;
  }

  const mailOptions = {
    from: `"Crewnect Support" <${SMTP_EMAIL}>`,
    to,
    subject: "Your Registration OTP for Crewnect",
    text: `Your One-Time Password (OTP) for Crewnect registration is: ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaec; border-radius: 10px;">
        <h2 style="color: #2563eb;">Crewnect Registration</h2>
        <p>You requested to register for a new account. Use the OTP below to complete your registration.</p>
        <div style="font-size: 32px; font-weight: bold; background-color: #f3f4f6; padding: 15px; text-align: center; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email.");
  }
}
