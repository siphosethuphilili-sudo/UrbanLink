import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: '.env.local' });

const app = express();
const port = Number(process.env.PORT || 3001);
const otpStore = new Map();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

function buildTransporter() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error('Email service is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS in .env.local.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = buildTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'urbanhub-email-api' });
});

app.post('/api/otp/send', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const otp = generateOtp();
    otpStore.set(email, { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    await sendEmail({
      to: email,
      subject: '[UrbanLink] Your verification code',
      text: `Your UrbanLink verification code is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111827;">
          <h2 style="margin-bottom: 12px;">UrbanLink verification</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 32px; letter-spacing: 6px; font-weight: 700; padding: 16px 0; color: #0f172a;">${otp}</div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    });

    return res.json({ success: true, message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('OTP send error:', error);
    return res.status(500).json({
      error: 'Failed to send OTP email.',
      message: error.message || 'Unknown error'
    });
  }
});

app.post('/api/otp/verify', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const otpCode = String(req.body?.otpCode || '').trim();

    if (!email || !otpCode) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const record = otpStore.get(email);
    if (!record) {
      return res.status(400).json({ error: 'No verification code was found for this email.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'Your verification code has expired. Please request a new one.' });
    }

    if (record.code !== otpCode) {
      return res.status(400).json({ error: 'The verification code is incorrect.' });
    }

    otpStore.delete(email);
    return res.json({
      success: true,
      access_token: `otp-${Date.now()}`,
      user: {
        email,
        displayName: email.split('@')[0],
        uid: `otp-${Date.now()}`
      },
      message: 'Email verified successfully.'
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    return res.status(500).json({
      error: 'Failed to verify OTP.',
      message: error.message || 'Unknown error'
    });
  }
});

app.post('/api/email', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, subject, and message are required.'
      });
    }

    const recipient = process.env.EMAIL_TO || process.env.EMAIL_USER;
    if (!recipient) {
      return res.status(500).json({
        error: 'No recipient email configured. Set EMAIL_TO or EMAIL_USER in .env.local.'
      });
    }

    await sendEmail({
      to: recipient,
      replyTo: email,
      subject: `[UrbanLink] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 12px;">New message from UrbanLink</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 10px;">
            ${message.replace(/\n/g, '<br />')}
          </div>
        </div>
      `
    });

    return res.json({ success: true, message: 'Your message was sent successfully.' });
  } catch (error) {
    console.error('Email API error:', error);
    return res.status(500).json({
      error: 'Failed to send email.',
      message: error.message || 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`UrbanHub email API running on http://localhost:${port}`);
});
