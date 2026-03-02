# 💧 Jal-Sanchaee-Navachar (Water Conservation Innovation)

Jal-Sanchaee-Navachar is a professional full-stack platform designed to revolutionize agricultural water management through smart irrigation planning and data-driven insights.

## 🌍 Problem Statement
In many regions, inefficient irrigation practices lead to significant water wastage and suboptimal crop yields. Farmers often lack precise data on how much water their crops need based on soil type, seasonal changes, and crop varieties.

## 💡 Solution Overview
This platform provides a comprehensive suite of tools for farmers to plan, monitor, and optimize their irrigation schedules. By leveraging real-time data and automated calculations, it ensures data-driven water conservation and improved agricultural productivity.

## 🧠 Key Features
- **Smart Irrigation Planner**: Generate 4-week irrigation schedules tailored to crop, soil, and area.
- **Dynamic Dashboard**: Monitor farm performance and upcoming tasks.
- **Role-Based Access**: Secure user profiles with Firebase Authentication.
- **Responsive Management**: Mobile-ready interface for on-field usage.
- **Smart Notifications**: Stay updated with critical irrigation alerts.

## 🏗 Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database & Auth**: Firebase (Firestore & Firebase Auth).
- **Communication**: Axios, React Hot Toast.

## ⚙️ Installation Steps

1. **Clone the repository**:
   ```bash
   cd Jal-Sanchaee-Navachar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

## 🔐 Environment Setup

1. Create a `.env` file in the `backend/` folder based on `.env.example`.
2. Fill in your Firebase configuration credentials:
   ```env
   PORT=5000
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

## 🚀 How to Run

### Run Locally (Development)

1. **Start Backend**:
   ```bash
   npm run start
   ```

2. **Start Frontend** (Open a new terminal):
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```text
Jal-Sanchaee-Navachar/
├── backend/                # Modular Express backend
│   ├── config/             # DB & Env configurations
│   ├── controllers/        # Request handlers
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   └── index.js            # Entry point
├── src/                    # React frontend
│   ├── assets/             # Images & static files
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom hooks & contexts
│   ├── pages/              # Page components
│   ├── services/           # API & external services
│   ├── utils/              # Helper functions
│   ├── App.jsx             # Main App & Routing
│   └── main.jsx            # Entry point
├── .gitignore              # Professional Git exclusion
└── README.md               # Documentation
```

## 🔮 Future Improvements
- **IoT Integration**: Real-time soil moisture sensor syncing.
- **Satellite Imagery**: Precision agriculture using NDVI mapping.
- **Multilingual Support**: Available in local regional languages.
- **AI Crop Recommendation**: Predictive analysis for better seasonal planning.

---
Built with ❤️ for a sustainable future.
