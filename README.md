# BudgetBuddy 💰

A personal finance tracker with AI-powered budgeting insights. Track income and expenses, set savings goals, view monthly reports, and get AI-generated suggestions to help you stay on budget.

**Live Demo:** [celadon-eclair-1f5d06.netlify.app](https://celadon-eclair-1f5d06.netlify.app/)
**Backend API:** [budget-buddy-sycl.onrender.com](https://budget-buddy-sycl.onrender.com/)

---

## Features

- **Income Management** — Add, edit, and delete income entries by source, amount, and date
- **Expense Management** — Track expenses by category, amount, and date
- **Dashboard** — At-a-glance view of income, expenses, savings goal, and budget left for the selected month
- **Monthly Budget** — Set a self-imposed spending ceiling and track how much of it you have left
- **Savings Goal** — Set a monthly savings target and track progress against it
- **Financial Reports** — Month-by-month breakdown with a category-wise expense pie chart and an AI-generated spending summary
- **AI Planner** — Generates a personalized, actionable budget plan for the selected month
- **Lifetime Overview** — A separate view of all-time income, expenses, and total savings (shown on the Savings Goal page, clearly labeled as lifetime — distinct from monthly figures)
- **Profile** — Basic account info and logout

---

## Tech Stack

**Frontend:** React (Create React App), `axios` for API calls, `recharts` for charts — deployed on **Netlify**

**Backend:** Node.js + Express — deployed on **Render**

**Database:** MongoDB with Mongoose — models for `Income`, `Expense`, `Budget`, `Goal`

**AI:** [Groq API](https://groq.com/) using the `openai/gpt-oss-120b` model, with **function/tool calling** (the app's financial data is small and structured, so the AI queries it directly rather than doing embedding-based retrieval over documents — no RAG is used here)

---

## AI Architecture

The app uses **tool calling**, not RAG. The model is given a `get_monthly_summary` tool it can call whenever it needs real numbers (income, expenses, category breakdown, savings goal) for a given month. The backend executes the actual database query and returns exact figures — the model never guesses or estimates financial data.

- **`askAI`** (`POST /api/ai/ask`) — powers the Dashboard's AI Suggestions, Reports' AI Spending Summary, and AI Planner's Generate Plan. Uses a tool-calling loop: the model calls `get_monthly_summary`, the backend runs `computeMonthlySummary()`, and the model answers grounded in that real data. The system prompt asks the model to consider both cutting expenses and increasing income, not just spending cuts.

- `computeMonthlySummary(userId, month)` in `budgetController.js` is the single source of truth for a month's `income`, `spent`, `netSavings`, and `categoryTotals` — every page pulls from this same function, keeping monthly figures consistent app-wide.

---

## Environment Variables

**Client** (`client/.env`):
```
REACT_APP_API_URL=https://budget-buddy-sycl.onrender.com
```

**Server** (`server/.env`):
```
GROQ_API_KEY=<your Groq API key>
MONGO_URI=<your MongoDB connection string>
```

> Note: Create React App embeds environment variables at build time. If you add or change a `.env` value, restart the dev server or trigger a fresh build for the change to take effect.

---

## Project Structure

```
BudgetBuddy/
├── client/
│   └── src/
│       ├── Pages/
│       │   ├── Dashboard.js
│       │   ├── Income.js
│       │   ├── Expense.js
│       │   ├── Goal.js
│       │   ├── AIPlanner.js
│       │   └── Reports.js
│       └── styles/
├── server/
│   ├── controller/
│   │   ├── aiController.js
│   │   └── budgetController.js
│   ├── models/
│   │   ├── Income.js
│   │   ├── Expense.js
│   │   ├── Budget.js
│   │   └── Goal.js
│   └── routes/
│       ├── income.js
│       ├── budget.js
│       ├── goal.js
│       └── ai.js
```

---

## Running Locally

```bash
# Backend
cd server
npm install
npm start

# Frontend (in a separate terminal)
cd client
npm install
npm start
```

Make sure both `.env` files above are set up first.