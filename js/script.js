const API = 'api';
const form = document.getElementById('expense-form');
const tbody = document.getElementById('expenses-tbody');
const message = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');

function showMessage(text, ok=true) {
  message.textContent = text;
  message.style.color = ok ? '' : 'red';
  setTimeout(()=> { if (message.textContent === text) message.textContent = ''; }, 4000);
}

async function apiFetch(path, data = null) {
  const url = `${API}/${path}`;
  const opts = data ? {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  } : { method: 'GET' };
  const res = await fetch(url, opts);
  if (!res.ok) {
    const txt = await res.text().catch(()=>res.statusText);
    throw new Error(txt || 'Network response was not ok');
  }
  return res.json();
}

function resetForm() {
  form.reset();
  document.getElementById('expense-id').value = '';
  submitBtn.textContent = 'Add Expense';
}

function buildRow(exp) {
  const tr = document.createElement('tr');

  const descTd = document.createElement('td'); descTd.textContent = exp.description; tr.appendChild(descTd);
  const amtTd = document.createElement('td'); amtTd.textContent = parseFloat(exp.amount).toFixed(2); tr.appendChild(amtTd);
  const catTd = document.createElement('td'); catTd.textContent = exp.category; tr.appendChild(catTd);
  const dateTd = document.createElement('td'); dateTd.textContent = exp.date; tr.appendChild(dateTd);

  const actionsTd = document.createElement('td');
  const editBtn = document.createElement('button'); editBtn.textContent = 'Edit'; editBtn.className = 'actions-button small btn-edit';
  const delBtn = document.createElement('button'); delBtn.textContent = 'Delete'; delBtn.className = 'actions-button small btn-delete';

  editBtn.addEventListener('click', () => {
    document.getElementById('expense-id').value = exp.id;
    document.getElementById('description').value = exp.description;
    document.getElementById('amount').value = exp.amount;
    document.getElementById('category').value = exp.category;
    document.getElementById('date').value = exp.date;
    submitBtn.textContent = 'Update Expense';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  delBtn.addEventListener('click', async () => {
    if (!confirm('Delete this expense?')) return;
    try {
      const res = await apiFetch('delete_expense.php', { id: exp.id });
      if (res.success) {
        showMessage('Deleted.');
        loadExpenses();
      } else {
        showMessage('Delete failed', false);
      }
    } catch (err) {
      showMessage('Delete error', false);
      console.error(err);
    }
  });

  actionsTd.appendChild(editBtn);
  actionsTd.appendChild(document.createTextNode(' '));
  actionsTd.appendChild(delBtn);
  tr.appendChild(actionsTd);
  return tr;
}

async function loadExpenses(){
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try {
    const res = await apiFetch('fetch_expenses.php');
    if (!res.success) {
      tbody.innerHTML = '<tr><td colspan="5">Failed to load</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    if (res.expenses.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No expenses yet.</td></tr>';
      return;
    }
    res.expenses.forEach(exp => tbody.appendChild(buildRow(exp)));
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5">Error loading expenses</td></tr>';
    console.error(err);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('expense-id').value;
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value.trim();
  const date = document.getElementById('date').value;

  if (!description || !category || !date || isNaN(amount) || amount <= 0) {
    showMessage('Please fill valid values', false);
    return;
  }

  const payload = { description, amount, category, date };

  try {
    if (id) {
      payload.id = parseInt(id, 10);
      const res = await apiFetch('update_expense.php', payload);
      if (res.success) {
        showMessage('Updated successfully');
        resetForm();
        loadExpenses();
      } else showMessage('Update failed', false);
    } else {
      const res = await apiFetch('add_expense.php', payload);
      if (res.success) {
        showMessage('Added successfully');
        resetForm();
        loadExpenses();
      } else showMessage('Add failed', false);
    }
  } catch (err) {
    showMessage('Server error', false);
    console.error(err);
  }
});

document.getElementById('reset-btn').addEventListener('click', () => resetForm());

// initial load
loadExpenses();