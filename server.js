const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static("public"));
app.use('/frames', express.static(path.join(__dirname, 'frames')));

// Create frames directory if it doesn't exist
const framesDir = path.join(__dirname, 'frames');
if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
    console.log('📁 Created frames directory. Please add your PORTRAIT frame images (300x900px):');
    console.log('   - frame1.png, frame2.png, frame3.png');
}

// Nodemailer transporter with better error handling
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "akinmonsan@gmail.com",
        pass: "knrvkblolzxkbigb", // Gunakan App Password untuk keamanan yang lebih baik
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});

// Verify email configuration on startup
transporter.verify(function(error, success) {
    if (error) {
        console.error('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email server is ready to take our messages');
    }
});

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Route to handle email sending
app.post("/send-email", upload.single("photo"), async (req, res) => {
    try {
        const { email } = req.body;
        const photo = req.file;

        // Validation
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ 
                success: false,
                message: "Valid email address is required" 
            });
        }

        if (!photo) {
            return res.status(400).json({ 
                success: false,
                message: "Photo is required" 
            });
        }

        // Create email content
        const currentDate = new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const mailOptions = {
            from: {
                name: 'Photobooth',
                address: 'sekital@ub.ac.id'
            },
            to: email,
            subject: "📸 Your Photobooth Memories",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
                    <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #374151; margin: 0 0 10px 0; font-size: 28px;">📸Photobooth</h1>
                            <p style="color: #6b7280; margin: 0; font-size: 16px;">Your portrait memories captured on ${currentDate}</p>
                        </div>
                        
                        <div style="background: #f8fafc; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center;">
                            <h2 style="color: #374151; margin: 0 0 15px 0; font-size: 20px;">✨ Thank you for using our photobooth!</h2>
                            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
                                We hope you had a great time capturing these portrait memories. Your photos are attached to this email in high quality.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; border-radius: 25px; font-weight: bold;">
                                🖼️ Portrait Frame: 5x15cm • 3 Photos in 4:3 ratio
                            </div>
                        </div>
                        
                        <div style="background: #e0f2fe; border-radius: 12px; padding: 15px; margin: 20px 0;">
                            <h3 style="color: #0369a1; margin: 0 0 10px 0; font-size: 16px;">📐 Frame Details:</h3>
                            <ul style="color: #0284c7; margin: 5px 0; padding-left: 20px; font-size: 14px;">
                                <li>Portrait orientation (tall format)</li>
                                <li>3 landscape photos arranged vertically</li>
                                <li>Perfect for printing at 5x15cm</li>
                                <li>High quality PNG format</li>
                            </ul>
                        </div>
                        
                        <hr style="border: none; height: 1px; background: #e2e8f0; margin: 30px 0;">
                        
                        <div style="text-align: center; color: #6b7280; font-size: 14px;">
                            <p style="margin: 5px 0;">Universitas Brawijaya</p>
                        </div>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: `photobooth-portrait-${new Date().toISOString().slice(0, 10)}.png`,
                    content: photo.buffer,
                    contentType: 'image/png'
                },
            ],
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        
        res.json({ 
            success: true,
            message: "Email sent successfully! Check your inbox.",
            messageId: info.messageId
        });

    } catch (error) {
        console.error('❌ Error sending email:', error);
        
        // Handle specific errors
        let errorMessage = "Failed to send email. Please try again.";
        
        if (error.code === 'EAUTH') {
            errorMessage = "Email authentication failed. Please check email configuration.";
        } else if (error.code === 'ECONNECTION') {
            errorMessage = "Unable to connect to email server. Please check internet connection.";
        } else if (error.responseCode === 550) {
            errorMessage = "Invalid email address. Please check and try again.";
        }
        
        res.status(500).json({ 
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Route to get available frames
app.get("/api/frames", (req, res) => {
    try {
        const frames = [];
        const frameFiles = ['frame1.png', 'frame2.png', 'frame3.png'];
        
        frameFiles.forEach((filename, index) => {
            const framePath = path.join(framesDir, filename);
            if (fs.existsSync(framePath)) {
                frames.push({
                    id: `frame${index + 1}`,
                    filename: filename,
                    name: `Frame ${index + 1}`,
                    path: `/frames/${filename}`
                });
            }
        });
        
        res.json({ success: true, frames });
    } catch (error) {
        console.error('Error getting frames:', error);
        res.status(500).json({ success: false, message: "Error loading frames" });
    }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        service: "SEKITA Photobooth Server"
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false,
                message: 'File too large. Maximum size is 5MB.' 
            });
        }
    }
    
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Endpoint not found' 
    });
});

// Start server
app.listen(port, () => {
    console.log(`
╔══════════════════════════════════════╗
║        📸 PHOTOBOOTH                 ║
║              SERVER                  ║
╠══════════════════════════════════════╣
║  🌐 Server: http://localhost:${port}   ║
║  📁 Frames: ./frames/                ║
║  📧 Email: configured                ║
╚══════════════════════════════════════╝
    `);
    
    // Instructions
    console.log('\n📋 Setup Instructions:');
    console.log('1. Place your frame images in ./frames/ directory:');
    console.log('   - frame1.png (PORTRAIT 5x15cm, 300x900px recommended)');
    console.log('   - frame2.png (PORTRAIT 5x15cm, 300x900px recommended)'); 
    console.log('   - frame3.png (PORTRAIT 5x15cm, 300x900px recommended)');
    console.log('2. Photo areas: 3 slots of 200x150px (4:3 landscape)');
    console.log('3. Positions: Top(50,100), Middle(50,375), Bottom(50,650)');
    console.log('4. Update email credentials in the code');
    console.log('5. Place HTML file in ./public/ directory');
    console.log('\n✨ Ready to capture portrait memories!');
});