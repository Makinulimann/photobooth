const fs = require("fs");
const path = require("path");

console.log(`
╔══════════════════════════════════════╗
║        📸 SEKITA PHOTOBOOTH         ║
║            SETUP SCRIPT              ║
╚══════════════════════════════════════╝
`);

// Create necessary directories
const directories = ["public", "frames", "uploads"];

directories.forEach((dir) => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}/`);
    } else {
        console.log(`📁 Directory already exists: ${dir}/`);
    }
});

// Create sample frame files if they don't exist
const sampleFrames = [
    { name: "frame1.png", color: "#ffffff", label: "White Frame" },
    { name: "frame2.png", color: "#7f1d1d", label: "Maroon Frame" },
    { name: "frame3.png", color: "#1e40af", label: "Blue Frame" },
];

console.log("\n📷 Setting up frame templates...");

sampleFrames.forEach((frame, index) => {
    const framePath = path.join(__dirname, "frames", frame.name);
    if (!fs.existsSync(framePath)) {
        // Create a portrait SVG template (5x15cm = 300x900px)
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="900" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="300" height="900" fill="${frame.color}"/>
  
  <!-- Photo placeholders (4:3 landscape ratio, 200x150px) -->
  <!-- Photo 1 - Top -->
  <rect x="50" y="100" width="200" height="150" fill="none" stroke="#cccccc" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
  <text x="150" y="180" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#999999">Photo 1</text>
  
  <!-- Photo 2 - Middle -->
  <rect x="50" y="375" width="200" height="150" fill="none" stroke="#cccccc" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
  <text x="150" y="455" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#999999">Photo 2</text>
  
  <!-- Photo 3 - Bottom -->
  <rect x="50" y="650" width="200" height="150" fill="none" stroke="#cccccc" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
  <text x="150" y="730" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#999999">Photo 3</text>
  
  <!-- Header -->
  <text x="150" y="40" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="${frame.color === "#ffffff" ? "#333333" : "#ffffff"
            }">SEKITA</text>
  <text x="150" y="60" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="${frame.color === "#ffffff" ? "#666666" : "#cccccc"
            }">PHOTOBOOTH</text>
  
  <!-- Footer -->
  <text x="150" y="850" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="${frame.color === "#ffffff" ? "#666666" : "#cccccc"
            }">📅 ${new Date().getFullYear()}</text>
  <text x="150" y="870" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="${frame.color === "#ffffff" ? "#666666" : "#cccccc"
            }">📏 Portrait 5x15cm</text>
  
  <!-- Decorative elements -->
  <!-- Top corners -->
  <circle cx="25" cy="25" r="15" fill="none" stroke="${frame.color === "#ffffff" ? "#cccccc" : "#ffffff"
            }" stroke-width="2"/>
  <circle cx="275" cy="25" r="15" fill="none" stroke="${frame.color === "#ffffff" ? "#cccccc" : "#ffffff"
            }" stroke-width="2"/>
  
  <!-- Bottom corners -->
  <circle cx="25" cy="875" r="15" fill="none" stroke="${frame.color === "#ffffff" ? "#cccccc" : "#ffffff"
            }" stroke-width="2"/>
  <circle cx="275" cy="875" r="15" fill="none" stroke="${frame.color === "#ffffff" ? "#cccccc" : "#ffffff"
            }" stroke-width="2"/>
  
  <!-- Side decorations -->
  <line x1="10" y1="300" x2="10" y2="600" stroke="${frame.color === "#ffffff" ? "#cccccc" : "#ffffff"
            }" stroke-width="3" stroke-linecap="round"/>
  <line x1="290" y1="300" x2="290" y2="600" stroke="${frame.color === "#ffffff" ? "#cccccc" : "#ffffff"
            }" stroke-width="3" stroke-linecap="round"/>
</svg>`;

        fs.writeFileSync(framePath, svgContent);
        console.log(`📄 Created sample frame: ${frame.name} (${frame.label})`);
    } else {
        console.log(`🖼️  Frame already exists: ${frame.name}`);
    }
});

// Create README.md
const readmeContent = `# 📸 SEKITA Photobooth

Modern offline photobooth application for SEKITA events.

## 🚀 Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Setup project:**
   \`\`\`bash
   npm run setup
   \`\`\`

3. **Place your HTML file in \`public/\` directory**

4. **Add your custom frame images to \`frames/\` directory:**
   - \`frame1.png\` (900x300px for 15x5cm)
   - \`frame2.png\` (900x300px for 15x5cm)  
   - \`frame3.png\` (900x300px for 15x5cm)

5. **Configure email in \`server.js\`:**
   - Update SMTP credentials
   - Use App Password for Gmail

6. **Start the server:**
   \`\`\`bash
   npm start
   \`\`\`

7. **Open browser:** http://localhost:3000

## 📁 Project Structure

\`\`\`
photobooth/
├── server.js          # Express server
├── package.json       # Dependencies
├── setup.js          # Setup script
├── public/           # Web files (HTML, CSS, JS)
├── frames/           # Frame images (15x5cm)
└── uploads/          # Temporary uploads
\`\`\`

## 🎨 Frame Specifications

- **Size:** 15x5cm (900x300px at 60 DPI)
- **Format:** PNG with transparency support
- **Photo areas:** 3 slots, each 240x192px (5:4 landscape ratio)
- **Photo positions:**
  - Photo 1: x=60, y=54
  - Photo 2: x=330, y=54  
  - Photo 3: x=600, y=54

## ✨ Features

- ✅ Offline functionality (except email)
- ✅ Real-time camera preview
- ✅ 5:4 landscape photo capture
- ✅ Custom frame overlay
- ✅ Email delivery with attachment
- ✅ Download functionality
- ✅ Modern responsive design
- ✅ Progress tracking
- ✅ Error handling

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2FA on your Gmail account
2. Generate App Password: Google Account → Security → App passwords
3. Update credentials in \`server.js\`

### Custom Frames
Create PNG images with:
- Transparent areas for photos
- Size: 900x300 pixels
- Save as: \`frame1.png\`, \`frame2.png\`, \`frame3.png\`

## 🚨 Troubleshooting

**Camera not working:**
- Check browser permissions
- Use HTTPS for production
- Ensure proper lighting

**Email not sending:**
- Verify SMTP credentials  
- Check App Password setup
- Test internet connection

**Photos not aligned:**
- Check frame image dimensions
- Verify photo position coordinates
- Ensure 5:4 aspect ratio

## 📱 Keyboard Shortcuts

- **Space:** Take photo
- **Escape:** Reset/start over

## 🎯 For Production

1. Use HTTPS certificate
2. Set proper email credentials
3. Configure firewall rules
4. Add error logging
5. Set up backup system

## 📞 Support

SEKITA - Senat Mahasiswa FILKOM UB
📧 sekital@ub.ac.id

---
Made with ❤️ for SEKITA events
`;

const readmePath = path.join(__dirname, "README.md");
if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readmeContent);
    console.log(`📋 Created README.md with setup instructions`);
}

// Create .gitignore
const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local

# Uploads and temp files
uploads/
temp/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Logs
logs/
*.log

# Production builds
dist/
build/
`;

const gitignorePath = path.join(__dirname, ".gitignore");
if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log(`📄 Created .gitignore`);
}

console.log(`
╔══════════════════════════════════════╗
║            ✅ SETUP COMPLETE         ║
╠══════════════════════════════════════╣
║  Next Steps:                         ║
║  1. Place HTML file in public/       ║
║  2. Add your frames to frames/       ║
║  3. Configure email in server.js     ║
║  4. Run: npm start                   ║
║                                      ║
║  📖 Read README.md for details       ║
╚══════════════════════════════════════╝
`);
