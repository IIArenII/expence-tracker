const Expense = require('../models/Expense');

// Create new expense
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      category,
      date: date || Date.now(),
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all expenses for logged-in user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    let expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if the logged-in user owns this expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update expense fields from req.body
    expense.title = req.body.title || expense.title;
    expense.amount = req.body.amount || expense.amount;
    expense.category = req.body.category || expense.category;
    expense.date = req.body.date || expense.date;

    await expense.save();

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if the logged-in user owns this expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await expense.deleteOne();

    res.json({ message: 'Expense removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

