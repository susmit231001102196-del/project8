const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)

function ExpenseList({ entries, categories, selectedCategory, onCategoryChange, onDelete }) {
  const visibleEntries =
    selectedCategory === 'All'
      ? entries
      : entries.filter((entry) => entry.category === selectedCategory)

  return (
    <div className="expense-list">
      <div className="list-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Recent activity</h2>
        </div>

        <label className="filter-field">
          <span>Category</span>
          <select value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visibleEntries.length === 0 ? (
        <div className="empty-state">No transactions match this category.</div>
      ) : (
        <ul className="transaction-list">
          {visibleEntries.map((entry) => (
            <li className="transaction-item" key={entry.id}>
              <div>
                <div className="transaction-main">
                  <h3>{entry.title}</h3>
                  <span className={`type-badge ${entry.type}`}>{entry.type}</span>
                </div>
                <p>
                  {entry.category} • {new Date(`${entry.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="transaction-actions">
                <strong className={entry.type === 'income' ? 'income-text' : 'expense-text'}>
                  {entry.type === 'income' ? '+' : '-'}
                  {formatCurrency(entry.amount)}
                </strong>
                <button type="button" className="delete-button" onClick={() => onDelete(entry.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ExpenseList
