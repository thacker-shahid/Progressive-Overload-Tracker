const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendVerificationEmail(to, code) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "GymLog <noreply@gymlog.com>",
    to,
    subject: "GymLog - Email Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px; background: #0c0c0c; color: #e8e8e8; border-radius: 4px;">
        <h1 style="color: #f97316; font-size: 24px; margin-bottom: 10px;">GymLog</h1>
        <p style="margin-bottom: 20px;">Your verification code is:</p>
        <div style="background: #1e1e1e; padding: 20px; text-align: center; border-radius: 4px; margin-bottom: 20px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f97316; font-family: monospace;">${code}</span>
        </div>
        <p style="color: #6b6b6b; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };

async function sendPasswordResetEmail(to, code) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "GymLog <noreply@gymlog.com>",
    to,
    subject: "GymLog - Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px; background: #0c0c0c; color: #e8e8e8; border-radius: 4px;">
        <h1 style="color: #f97316; font-size: 24px; margin-bottom: 10px;">GymLog</h1>
        <p style="margin-bottom: 20px;">You requested a password reset. Use this code to reset your password:</p>
        <div style="background: #1e1e1e; padding: 20px; text-align: center; border-radius: 4px; margin-bottom: 20px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f97316; font-family: monospace;">${code}</span>
        </div>
        <p style="color: #6b6b6b; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, please ignore this email — your password will remain unchanged.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
