const { computeMonthlySummary } = require("./budgetController");

const tools = [
  {
    type: "function",
    function: {
      name: "get_monthly_summary",
      description: "Get the user's total budget, income, amount spent, amount left, and category-wise spending for a given month",
      parameters: {
        type: "object",
        properties: {
          month: { type: "string", description: "Month in YYYY-MM format, e.g. 2026-09" }
        },
        required: ["month"]
      }
    }
  }
];

const callGroq = async (messages, useTools = true) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      max_tokens: 900,
      messages,
      ...(useTools ? { tools, tool_choice: "auto" } : {})
    })
  });
  return response.json();
};

// POST /api/ai/ask  { userId, question }
const askAI = async (req, res) => {
  try {
    const { userId, question } = req.body;

    if (!userId || !question) {
      return res.status(400).json({ message: "userId and question are required" });
    }

    const currentMonth = new Date().toISOString().slice(0, 7);

    let messages = [
      {
        role: "system",
        content: `You are a friendly personal finance assistant. The current month is ${currentMonth}. Always use the get_monthly_summary tool to get real numbers before answering — never guess. Use ₹ for currency. No markdown formatting. When suggesting how to improve their budget, consider BOTH options: cutting back on spending in specific categories, and realistic ways to increase income (e.g. picking up freelance work, tuition, part-time gigs, selling unused items). Choose whichever angle fits their numbers best.`
      },
      { role: "user", content: question }
    ];

    let data = await callGroq(messages);
    let message = data.choices?.[0]?.message;

    if (!message) {
      console.log("Groq API Error", data);
      return res.status(500).json({ message: "AI request failed" });
    }

    // Handles one or more sequential tool calls
    while (message?.tool_calls?.length) {
      messages.push(message);

      for (const call of message.tool_calls) {
        let result;

        if (call.function.name === "get_monthly_summary") {
          const args = JSON.parse(call.function.arguments);
          result = await computeMonthlySummary(userId, args.month || currentMonth);
        } else {
          result = { error: "Unknown tool" };
        }

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result)
        });
      }

      data = await callGroq(messages);
      message = data.choices?.[0]?.message;
    }

    const answer = message?.content || "No answer available right now.";

    res.status(200).json({ answer });

  } catch (error) {
    console.log("Ask AI Error", error);
    res.status(500).json({ message: "Server error answering question" });
  }
};

// Original one-shot suggestion endpoint — kept exactly as-is
const getSuggestions = async (req, res) => {
  try {
    const { totalIncome, totalExpense, goalAmount, categoryTotals } = req.body;

    if (totalIncome === undefined || totalExpense === undefined) {
      return res.status(400).json({ message: "Missing financial data" });
    }

    const categoryBreakdown = categoryTotals
      ? Object.entries(categoryTotals)
          .map(([cat, amt]) => `${cat}: ₹${amt}`)
          .join(", ")
      : "No category data available";

    const prompt = `You are a friendly personal finance assistant. Based on this user's monthly data:
- Total Income: ₹${totalIncome}
- Total Expense: ₹${totalExpense}
- Savings Goal: ₹${goalAmount || 0}
- Category breakdown: ${categoryBreakdown}

Give ONE short, specific, actionable suggestion (max 2 sentences) to help them save more or manage spending better. Be encouraging, not preachy. Use ₹ for currency. Do not use markdown formatting.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Groq API Error", data);
      return res.status(500).json({ message: "AI request failed" });
    }

    const suggestion = data.choices?.[0]?.message?.content || "No suggestion available right now.";

    res.status(200).json({ suggestion });

  } catch (error) {
    console.log("AI Suggestion Error", error);
    res.status(500).json({ message: "Server error generating suggestion" });
  }
};

module.exports = { askAI, getSuggestions };