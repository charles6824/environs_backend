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
	// service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
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
      from: `"Environfarm Newsletter" <connect@envirofarm.org>`,
      to: "connect@envirofarm.org", // Admin receives notification
      subject: "New Newsletter Subscription",
      text: `User with email ${email} has requested to join the newsletter.`,
    });

    res.json({ success: true, message: "Subscription email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// API route for lead flow consultation booking
app.post("/book-consultation", async (req, res) => {
  const leadData = req.body;

  if (!leadData.email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const emailContent = `
New Consultation Booking:

Package Details:
- Package: ${leadData.selectedPackage || 'N/A'}
- Price: ${leadData.selectedPrice || 'N/A'}

Business Information:
- Business Name: ${leadData.businessName || 'N/A'}
- Business Type: ${leadData.businessType || 'N/A'}
- Description: ${leadData.businessDescription || 'N/A'}
- City: ${leadData.city || 'N/A'}
- Service Area: ${leadData.serviceArea || 'N/A'}
- Website Status: ${leadData.websiteStatus || 'N/A'}
- Customer Acquisition: ${leadData.customerAcquisition || 'N/A'}

Contact Information:
- Full Name: ${leadData.fullName || 'N/A'}
- Role: ${leadData.role || 'N/A'}
- Email: ${leadData.email}
- Phone: ${leadData.phone || 'N/A'}
- Best Time to Call: ${leadData.bestTimeToCall || 'N/A'}
- Lead Source: ${leadData.leadSource || 'N/A'}

Project Details:
- Website Goal: ${leadData.websiteGoal || 'N/A'}
- Target Market: ${leadData.targetMarket || 'N/A'}
- Competitive Advantages: ${leadData.competitiveAdvantages || 'N/A'}
- Marketing Materials: ${leadData.marketingMaterials || 'N/A'}
- Feature Requests: ${leadData.featureRequests || 'N/A'}

Timeline & Notes:
- Timeline: ${leadData.timeline || 'N/A'}
- Urgency Reason: ${leadData.urgencyReason || 'N/A'}
- Additional Notes: ${leadData.additionalNotes || 'N/A'}

Consultation Details:
- Date: ${leadData.consultationDate || 'N/A'}
- Time: ${leadData.consultationTime || 'N/A'}
    `;

    await transporter.sendMail({
      from: `"Business Launchpad" <connect@envirofarm.org>`,
      to: "kukhonadigital@gmail.com",
      subject: `New Consultation Booking - ${leadData.businessName || leadData.fullName}`,
      text: emailContent,
    });

    res.json({ success: true, message: "Consultation booked successfully" });
  } catch (error) {
    console.error("Error sending consultation email:", error);
    res.status(500).json({ success: false, message: "Error booking consultation" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
