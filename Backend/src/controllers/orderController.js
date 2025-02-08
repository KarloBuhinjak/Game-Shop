const { sendEmail } = require("../config/mail");

createOrder = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (
    !email ||
    !email.trim() ||
    !name ||
    !name.trim() ||
    !subject ||
    !subject.trim() ||
    !message ||
    !message.trim()
  ) {
    return res
      .status(400)
      .json({ message: "name, email, subject and message are required" });
  }

  const receipients = email;

  sendEmail({ receipients, subject, message })
    .then((result) => {
      console.log("Email sent successfully:", result);
      return res.json({ message: "Email sent successfully!" });
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      if (!res.headersSent) {
        return res.status(500).json({ message: "Failed to send email", error });
      }
    });
};

module.exports = {
  createOrder,
};
