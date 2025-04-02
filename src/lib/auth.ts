import { randomInt } from "crypto";
import { google } from "googleapis";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const otpStore = new Map();

export const otp = randomInt(100000, 999999).toString();

export const oAuth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/api/auth/user/google/callback",
});

const scope = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const authorizationUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope,
  include_granted_scopes: true,
});
