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

module.exports = { getSuggestions };