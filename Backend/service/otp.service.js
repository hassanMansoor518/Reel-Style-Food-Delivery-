const SibApiV3Sdk = require("sib-api-v3-sdk");
const OTP = require("../model/otp.model");
require("dotenv").config();

// Setup Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Generate OTP
exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Save OTP
exports.saveOtp = async (userId, orderId, otp) => {
  const expires = Date.now() + 5 * 60 * 1000;

  await OTP.findOneAndDelete({ userId, orderId });

  const newOtp = new OTP({
    userId,
    orderId,
    otp,
    expiresAt: new Date(expires),
  });

  await newOtp.save();
};

// Send OTP Email
exports.sendOtpEmail = async (email, otp) => {
  try {
    const sendSmtpEmail = {
      sender: {
        name: "Food Delivery App",
        email: process.env.SENDER_EMAIL, // ← MUST MATCH BREVO VERIFIED SENDER
      },
      to: [{ email }],
      subject: "Your Order OTP Code",
      htmlContent: `<h2>Your OTP is <b>${otp}</b></h2>
                    <p>This OTP is valid for 5 minutes.</p>`
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("OTP Email Sent Successfully!");
    return true;

  } catch (err) {
    console.error("Brevo Email Error:", err.response?.body || err);
    return false;
  }
};

// Verify OTP
exports.verifyOtp = async (userId, orderId, otp) => {
  const record = await OTP.findOne({ userId, orderId });
  if (!record) return false;
  if (record.expiresAt < new Date()) return false;
  return record.otp === otp;
};
