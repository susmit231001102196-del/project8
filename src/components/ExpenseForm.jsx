import { useMemo, useState } from 'react'

const expenseCategories = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Health',
  'Education',
  'Entertainment',
  'Shopping',
  'Travel',
  'Other',
]

const incomeCategories = ['Salary', 'Freelance', 'Bonus', 'Investment', 'Other']

const getDefaultForm = () => ({
  title: '',
  amount: '',
  category: 'Food',
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
})

function ExpenseForm({ onSubmit }) {
  const [form, setForm] = useState(getDefaultForm)

  const categoryOptions = useMemo(
    () => (form.type === 'income' ? incomeCategories : expenseCategories),
    [form.type],
  )

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => {
      const updated = { ...previous, [name]: value }

      if (name === 'type') {
        updated.category = value === 'income' ? incomeCategories[0] : expenseCategories[0]
      }

      return updated
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const title = form.title.trim()
    const amount = Number(form.amount)

    if (!title || !Number.isFinite(amount) || amount <= 0) {
      return
    }

    onSubmit({
      title,
      amount,
      category: form.category,
      type: form.type,
      date: form.date,
    })

    setForm(getDefaultForm())
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <p className="eyebrow">Quick Entry</p>
          <h2>Add transaction</h2>
        </div>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            name="title"
            placeholder="e.g. Groceries"
            value={form.title}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            name="amount"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Type</span>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label className="field">
          <span>Category</span>
          <select name="category" value={form.category} onChange={handleChange}>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="field full-width">
          <span>Date</span>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
        </label>
      </div>

      <button className="primary-button" type="submit">
        Save Transaction
      </button>
    </form>
  )
}

export default ExpenseForm
