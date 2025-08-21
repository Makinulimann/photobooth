const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "akinmonsan@gmail.com",
        pass: "knrvkblolzxkbigb",
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

const mailOptions = {
    from: "your-email@gmail.com",
    to: "akunta1990@gmail.com", // Replace with a test email
    subject: "Test Email",
    text: "This is a test email from Nodemailer.",
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Email sent:", info.response);
    }
});
