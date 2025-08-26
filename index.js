import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer transporter (Gmail for now)
const transporter = nodemailer.createTransport({
  service: "gmail",
   auth: {
        user: "charlescharlesy@gmail.com",
        pass: "ktdx mfpw mwtp zfby",
      },
});

// API route for newsletter subscription
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    await transporter.sendMail({
      from: `"Envirofarm Newsletter" <support@envrofarm.com>`,
      to: "charlescharlesy@gmail.com", // Admin receives notification
      subject: "New Newsletter Subscription",
      text: `User with email ${email} has requested to join the newsletter.`,
    });

    res.json({ success: true, message: "Subscription email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
