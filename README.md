# 📍 HyperLocal Connect

**HyperLocal Connect** is a premium, AI-powered platform designed to bridge the gap between local job opportunities and skilled workers within a 15-20km radius. Built with a focus on trust, speed, and modern aesthetics.

---

## ✨ Key Features

### 🤖 AI-Powered Matching
- **Gemini AI Integration**: An intelligent AI assistant that understands natural language queries like *"Find me a plumber near Jubilee Hills"* and matches them with verified workers.
- **Smart Search**: Context-aware search for jobs and profiles.

### 🔒 Trust & Verification
- **Aadhaar Verification**: Seamless verification process with OTP simulation.
- **Multi-Factor Verification**: Email and Phone verification enforced for workers.
- **Role-Based Access**: Specialized portals for **Employers** (Job Posters) and **Workers** (Job Seekers).

### 💼 Job Lifecycle Management
- **Interactive Map View**: Discover jobs nearby using an integrated OpenStreetMap view.
- **Detailed Applications**: Workers can submit experience, contact info, and digital assets (like posters).
- **Approval Workflow**: Employers can review, chat, and approve applications in real-time.

### 💳 Secure Payments
- **Razorpay Integration**: Ready for secure financial transactions.
- **Simulation Mode**: A "Demo Mode" that allows full testing of the payment and OTP flow without requiring real bank credentials.
- **Transaction History**: Comprehensive payment logs for both employers and workers.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Tailwind CSS v4, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Socket.io (Real-time Chat).
- **Database**: MySQL (Sequelize ORM).
- **AI**: Google Gemini Pro (Generative AI).
- **Payments**: Razorpay API.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL Server

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/hyperlocal-connect.git
   cd hyperlocal-connect
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=hyperlocal_connect
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_key
   RAZORPAY_KEY_ID=test_key
   RAZORPAY_SECRET=test_secret
   ```
   Start the server:
   ```bash
   node server.js
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📱 Screenshots

| Landing Page | Find Jobs (Map) | AI Assistant |
| :---: | :---: | :---: |
| ![Landing](https://via.placeholder.com/300x200) | ![Jobs](https://via.placeholder.com/300x200) | ![AI](https://via.placeholder.com/300x200) |

---

## 🤝 Contribution
Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## 📄 License
This project is licensed under the MIT License.
