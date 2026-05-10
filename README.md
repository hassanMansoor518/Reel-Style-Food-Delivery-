# 🍔 FoodReel: Cinematic Food Delivery Experience (MERN)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A premium, high-fidelity food delivery platform featuring a cinematic **Reel-Style** browsing experience. Built with the MERN stack and inspired by modern design leaders like Uber Eats and Apple.

---

## ✨ Key Enhancements

### 🎨 Premium Design System
- **Cinematic Aesthetic**: A deep black `#050505` theme with Apple-inspired glassmorphism and vibrant orange accents.
- **Atomic Architecture**: Reusable component library including high-fidelity Buttons, Cards, Inputs, and Modals.
- **Global Theming**: Centralized `theme.css` for 100% visual consistency across the entire ecosystem.

### 👨‍🍳 Partner Dashboard (V2)
- **Cinematic Profile**: Partners now have a stunning, high-contrast dashboard to manage their kitchen.
- **Profile Customization**: Full control over restaurant identity—edit Banners, Logos (URL/Emoji), and contact metadata.
- **Menu Control**: Sophisticated CRUD interface for food items with real-time video previewing.
- **Reel Management**: Specialized vertical video upload system optimized for the "Food Reel" user experience.

### 📍 Smart Order Tracking
- **Voyager Map Integration**: Clean, Google Maps-style light theme for precise real-time order tracking.
- **Iconographic Context**: Context-aware icons (Pizza, Burgers, Shopping Bags) for an intuitive delivery timeline.

---

## 🚀 Core Features

### 👤 User Experience
* 🎞️ **Food Reels** – Immerse yourself in vertical video scrolling to discover your next meal.
* 🛒 **Seamless Checkout** – High-speed order placement with a modern interactive UI.
* 💳 **Demo Payments** – OTP-gated checkout flow for secure simulation.
* 📱 **Mobile-First** – Fully optimized for the modern mobile web.

### 🛠️ Partner Management
* 📦 **Live Menu Editing** – Instant updates to food details, pricing, and ratings.
* 🎥 **Video Reel Uploads** – Direct video processing for the reel feed.
* 🔐 **Partner Auth** – Secure login/logout system for restaurant owners.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (Premium Design System)
- Framer Motion (Micro-animations)
- Lucide React (Iconography)
- React Leaflet (Light Voyager Maps)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Socket.io (Real-time events)
- Axios (API Communication)

---

## 📸 Visuals

> [!TIP]
> This project utilizes a specialized **Design System** located in `src/theme` and `src/components/common`.

---

## 🔧 Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/hassanMansoor518/Reel-Style-Food-Delivery-
   ```

2. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   npx nodemon
   ```

4. **Environment Variables:**
   Configure your `.env` in the Backend folder with your MongoDB URI and Auth secrets.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
