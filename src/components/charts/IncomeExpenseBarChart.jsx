function IncomeExpenseBarChart({ entries }) {
  const monthNames = Array.from({ length: 6 }, (_, index) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - index))
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  })

  const monthData = monthNames.map((month) => {
    const monthEntries = entries.filter((entry) => entry.date.startsWith(month))

    return {
      label: new Date(`${month}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short' }),
      income: monthEntries
        .filter((entry) => entry.type === 'income')
        .reduce((sum, entry) => sum + Number(entry.amount), 0),
      expense: monthEntries
        .filter((entry) => entry.type === 'expense')
        .reduce((sum, entry) => sum + Number(entry.amount), 0),
    }
  })

  const maxValue = Math.max(...monthData.map((month) => Math.max(month.income, month.expense)), 1)

  return (
    <div className="chart-card">
      <div className="section-header compact-header">
        <h3>Income vs expense</h3>
      </div>

      <div className="bar-chart-wrap">
        <svg viewBox="0 0 420 220" role="img" aria-label="Income and expense bar chart">
          <line x1="30" y1="160" x2="390" y2="160" className="axis-line" />
          <line x1="30" y1="30" x2="30" y2="160" className="axis-line" />

          {monthData.map((month, index) => {
            const x = 50 + index * 60
            const incomeHeight = (month.income / maxValue) * 110
            const expenseHeight = (month.expense / maxValue) * 110

            return (
              <g key={month.label}>
                <rect x={x} y={160 - incomeHeight} width="18" height={incomeHeight} rx="6" fill="#8b5cf6" />
                <rect x={x + 22} y={160 - expenseHeight} width="18" height={expenseHeight} rx="6" fill="#f59e0b" />
                <text x={x + 18} y="180" textAnchor="middle" className="axis-text">
                  {month.label}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="chart-legend-inline">
          <span><i className="legend-color income-color" /> Income</span>
          <span><i className="legend-color expense-color" /> Expense</span>
        </div>
      </div>
    </div>
  )
}

export default IncomeExpenseBarChart
