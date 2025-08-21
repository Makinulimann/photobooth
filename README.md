# 📸Photobooth

Modern offline photobooth application for events.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup project:**
   ```bash
   npm run setup
   ```

3. **Place your HTML file in `public/` directory**

4. **Add your custom frame images to `frames/` directory:**
   - `frame1.png` (900x300px for 15x5cm)
   - `frame2.png` (900x300px for 15x5cm)  
   - `frame3.png` (900x300px for 15x5cm)

5. **Configure email in `server.js`:**
   - Update SMTP credentials
   - Use App Password for Gmail

6. **Start the server:**
   ```bash
   npm start
   ```

7. **Open browser:** http://localhost:3000

## 📁 Project Structure

```
photobooth/
├── server.js          # Express server
├── package.json       # Dependencies
├── setup.js          # Setup script
├── public/           # Web files (HTML, CSS, JS)
├── frames/           # Frame images (15x5cm)
└── uploads/          # Temporary uploads
```

## 🎨 Frame Specifications

- **Size:** 15x5cm (900x300px at 60 DPI)
- **Format:** PNG with transparency support
- **Photo areas:** 3 slots, each 200x150px 
- **Photo positions:**
  - Photo 1: x=50, y=100
  - Photo 2: x=50, y=375  
  - Photo 3: x=50, y=650

## ✨ Features

- ✅ Offline functionality (except email)
- ✅ Real-time camera preview
- ✅ 4:3 landscape photo capture
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
3. Update credentials in `server.js`

### Custom Frames
Create PNG images with:
- Transparent areas for photos
- Size: 900x300 pixels
- Save as: `frame1.png`, `frame2.png`, `frame3.png`

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

## 📱 Keyboard Shortcuts

- **Space:** Take photo
- **Escape:** Reset/start over

## 🎯 For Production

1. Use HTTPS certificate
2. Set proper email credentials
3. Configure firewall rules
4. Add error logging
5. Set up backup system


