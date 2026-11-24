const expenseForm = document.getElementById('expense-form');
const nameInput = document.getElementById('expense-name');
const amountInput = document.getElementById('expense-amount');
const categoryInput = document.getElementById('expense-category');
const errorMessage = document.getElementById('error-message');
const expenseList = document.getElementById('expense-list');
const totalAmountDisplay = document.getElementById('total-amount');
const filterCategory = document.getElementById('filter-category');
const emptyState = document.getElementById('empty-state');

let expenses = [];

// Handle Form Submission
expenseForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  // Input Validation
  if (!name) {
    errorMessage.textContent = 'Please enter a valid expense name.';
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    errorMessage.textContent = 'Please enter an amount greater than 0.';
    return;
  }

  errorMessage.textContent = '';

  // Create expense object
  const newExpense = {
    id: Date.now(),
    name,
    amount,
    category
  };

  expenses.push(newExpense);

  // Reset form inputs
  expenseForm.reset();
  renderExpenses();
});

// Handle Category Filter Change
filterCategory.addEventListener('change', renderExpenses);

// Delete Expense Function
function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  renderExpenses();
}

// Render Expenses & Update Total
function renderExpenses() {
  const selectedCategory = filterCategory.value;

  // Filter expenses based on dropdown selection
  const filteredExpenses =
    selectedCategory === 'All'
      ? expenses
      : expenses.filter(expense => expense.category === selectedCategory);

  // Clear table body
  expenseList.innerHTML = '';

  // Toggle empty state message
  if (filteredExpenses.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  // Populate rows
  filteredExpenses.forEach(expense => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${escapeHTML(expense.name)}</td>
      <td><span class="badge">${expense.category}</span></td>
      <td>₹${expense.amount.toFixed(2)}</td>
      <td>
        <button class="btn-delete" onclick="deleteExpense(${expense.id})">Delete</button>
      </td>
    `;

    expenseList.appendChild(row);
  });

  // Calculate and display total for currently visible expenses
  const total = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  totalAmountDisplay.textContent = `₹${total.toFixed(2)}`;
}

// Helper to prevent XSS when rendering user input
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
