# PennyWise ✨ Aesthetic Personal Finance Tracker

> *"Little steps today, bigger dreams tomorrow." 🌸*

**PennyWise** is a full-stack personal finance tracker inspired by Pinterest, cute Gen-Z planners, and soft feminine aesthetics. It pairs mindful budgeting, savings goal tracking, and detailed spending analytics with a soothing visual palette: Lavender (`#DCD3FF`), Blush Pink (`#F8DCE8`), Cream (`#FFF9F2`), Deep Plum (`#493B5A`), Muted Purple (`#8C78C8`), and Soft Mint (`#DDF2E4`).

All financial values are formatted in **Indian Rupees (₹)** with the Indian numbering format (`₹1,25,000`).

---

## 🎀 Architecture & Tech Stack

- **Frontend**: React 18, Vite, Recharts, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, CORS, dotenv
- **Database**: MongoDB (`mongodb://127.0.0.1:27017/pennywise`)
- **Inspection**: MongoDB Compass

---

## 📁 Project Structure

```
PennyWise/
  frontend/
    src/
      components/
        AddTransactionModal.jsx    # Add/edit income & expenses
        AddBudgetModal.jsx         # Monthly category allowances
        AddGoalModal.jsx           # Dream savings goal creator
        ContributeGoalModal.jsx    # Deposit savings with celebratory confetti
        DeleteConfirmModal.jsx     # Polite deletion confirmation modal
      pages/
        AuthPage.jsx               # Register & Login with cute avatars
        DashboardPage.jsx          # Warm greetings, metrics, pastel charts
        TransactionsPage.jsx       # CRUD, search, filter, sort, CSV export
        BudgetsPage.jsx            # Monthly progress bars & budget warnings
        SavingsGoalsPage.jsx       # Dream milestones & achievement celebrations
        AnalyticsPage.jsx          # Spending trends, category breakdown & tips
      context/
        AuthContext.jsx            # User session & JWT state
        ToastContext.jsx           # Animated pastel toast notifications
      services/
        api.js                     # Centralized API service with auth tokens
      layouts/
        MainLayout.jsx             # Cute sidebar & responsive mobile navigation
      utils/
        formatters.js              # Indian Rupee (₹) formatters, categories, greetings
      App.jsx                      # App root with auth guard & quick-add
      main.jsx                     # Vite React entry point
      index.css                    # Soft feminine design system
    public/
      favicon.svg
    index.html
    package.json
    vite.config.js
    .env.example
    .env
  backend/
    config/
      db.js                        # Mongoose MongoDB connection & health check
    models/
      User.js                      # User schema with bcrypt password hashing
      Transaction.js               # Income & Expense records with user scoping
      Budget.js                    # Monthly category spending limits
      SavingsGoal.js               # Dream goals with contributions history
    controllers/
      authController.js            # Registration, login, profile management
      transactionController.js     # Transaction CRUD & dashboard summary
      budgetController.js          # Monthly budgets with live spending aggregation
      savingsController.js         # Savings goals & contribution deposits
      analyticsController.js       # Trends, category breakdowns & smart insights
    routes/
      authRoutes.js
      transactionRoutes.js
      budgetRoutes.js
      savingsRoutes.js
      analyticsRoutes.js
    middleware/
      auth.js                      # JWT bearer token verification
      errorHandler.js              # Centralized error handler
    utils/
      seedData.js                  # Demo data populator for instant rich testing
    server.js                      # Main Express server & health endpoint
    package.json
    .env.example
    .env
  .gitignore
  README.md
```

---

## 🚀 Quick Start Guide (Windows)

### Prerequisites

1. **Node.js**: Ensure Node.js (v18+) is installed.
   ```powershell
   node -v
   npm -v
   ```
2. **MongoDB Community Server**: Required to run the local database `mongodb://127.0.0.1:27017/pennywise`.
3. **MongoDB Compass**: To inspect collections (`users`, `transactions`, `budgets`, `savingsgoals`).

---

### Step 1: Install Dependencies

Open PowerShell in the `PennyWise` directory:

#### Install Backend Dependencies:
```powershell
cd "c:\Users\Sampada Suryawanshi\OneDrive\Desktop\25070521012\PennyWise\backend"
npm install
```

#### Install Frontend Dependencies:
```powershell
cd "c:\Users\Sampada Suryawanshi\OneDrive\Desktop\25070521012\PennyWise\frontend"
npm install
```

---

### Step 2: Configure Environment Variables

The project already includes default `.env` files for both frontend and backend.

- **Backend** (`PennyWise/backend/.env`):
  ```env
  PORT=5000
  MONGODB_URI=mongodb://127.0.0.1:27017/pennywise
  JWT_SECRET=pennywise_aesthetic_sparkle_jwt_secret_key_2026
  JWT_EXPIRE=30d
  NODE_ENV=development
  ```

- **Frontend** (`PennyWise/frontend/.env`):
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```

---

### Step 3: MongoDB Setup & Compass Connection

#### A. Starting MongoDB Community Server on Windows
If MongoDB is installed as a Windows Service, verify or start it:
```powershell
# Check or start MongoDB service
net start MongoDB
```

If MongoDB is installed as a standalone executable:
```powershell
& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

> **Note on Manual Setup if MongoDB is not yet installed:**
> 1. Download **MongoDB Community Server** (.msi installer) from:  
>    https://www.mongodb.com/try/download/community
> 2. Run the installer and check the box **"Install MongoD as a Service"** and **"Install MongoDB Compass"**.
> 3. Click **Finish**. The MongoDB service will start automatically in the background.

#### B. Connecting via MongoDB Compass
1. Launch **MongoDB Compass**.
2. In the connection string field, paste:
   ```
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. You will see the `pennywise` database appear with collections:
   - `users`
   - `transactions`
   - `budgets`
   - `savingsgoals`

---

### Step 4: Running the Application

You need two terminal windows:

#### Terminal 1 — Start the Backend Server (Port 5000):
```powershell
cd "c:\Users\Sampada Suryawanshi\OneDrive\Desktop\25070521012\PennyWise\backend"
npm run dev
```
*Health Check*: Visit `http://localhost:5000/api/health` in your browser. You will receive:
```json
{
  "status": "ok",
  "message": "PennyWise API is running smoothly ✨🌸",
  "database": { "connected": true, "name": "pennywise" }
}
```

#### Terminal 2 — Start the Frontend Development Server (Port 5173):
```powershell
cd "c:\Users\Sampada Suryawanshi\OneDrive\Desktop\25070521012\PennyWise\frontend"
npm run dev
```
Open **`http://localhost:5173`** in your browser! 🌸

---

## 🌸 Key Features Walkthrough

1. **Warm Princess Greetings & Motivational Quotes**: Dynamic greeting (`Good morning, princess ✨`, `Good afternoon, sunshine 🌸`, etc.) and a quote generator at the top of your dashboard.
2. **Instant Demo Data Seeder**: Click the **"Load Demo Data ✨"** button in the sidebar anytime to instantly populate authentic transactions (Matcha lattes, freelance design, apartment rent), category budgets, and savings goals!
3. **Comprehensive Transaction Manager**:
   - Filter by Type (Income/Expense), Category, and Payment Method (UPI / GPay, Credit Card, Debit Card, Cash, Net Banking).
   - Real-time search by description or notes.
   - Polite deletion modal with confirmation before removing items.
   - **Export to CSV** button to download your finances.
4. **Category Budgets with Visual Alerts**:
   - Monthly category limits in ₹.
   - Progress bar colors: Soft Mint (<80%), Warning Peach (80–99%), Danger Rose (≥100%).
   - Displays exact amount spent, remaining allowance, and over-budget warnings.
5. **Dream Savings Goals**:
   - Set targets with target completion dates and cute emojis (`✈️`, `💻`, `🌸`, `💍`, `🏡`).
   - Deposit incremental contributions.
   - **Confetti explosion effect** when you reach 100%!
6. **Smart Analytics & Recommendations**:
   - Monthly trend graphs (past months income vs expense lines).
   - Category breakdown donut & progress meters.
   - Payment method breakdown.
   - Automatically calculated tips based on your real records.
