const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)

function ExpenseSummary({ entries, month, onExportCsv }) {
  const totalIncome = entries
    .filter((entry) => entry.type === 'income')
    .reduce((sum, entry) => sum + Number(entry.amount), 0)

  const totalExpense = entries
    .filter((entry) => entry.type === 'expense')
    .reduce((sum, entry) => sum + Number(entry.amount), 0)

  const net = totalIncome - totalExpense
  const monthLabel = new Date(`${month}-01T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="summary-panel-content">
      <div className="summary-header">
        <div>
          <p className="eyebrow">Financial snapshot</p>
          <h2>{monthLabel}</h2>
        </div>

        <button type="button" className="secondary-button" onClick={onExportCsv}>
          Export CSV
        </button>
      </div>

      <div className="summary-grid">
        <div className="metric-card income-card">
          <span>Income</span>
          <strong>{formatCurrency(totalIncome)}</strong>
        </div>

        <div className="metric-card expense-card">
          <span>Expenses</span>
          <strong>{formatCurrency(totalExpense)}</strong>
        </div>

        <div className="metric-card net-card">
          <span>Net</span>
          <strong>{formatCurrency(net)}</strong>
        </div>
      </div>
    </div>
  )
}

export default ExpenseSummary
