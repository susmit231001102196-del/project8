const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)

const palette = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f97316', '#ef4444']

function ExpensePieChart({ entries }) {
  const expensesByCategory = entries
    .filter((entry) => entry.type === 'expense')
    .reduce((summary, entry) => {
      summary[entry.category] = (summary[entry.category] ?? 0) + Number(entry.amount)
      return summary
    }, {})

  const categories = Object.entries(expensesByCategory)
  const total = categories.reduce((sum, [, amount]) => sum + amount, 0)

  if (categories.length === 0) {
    return (
      <div className="chart-card empty-chart">
        <h3>Expense by category</h3>
        <p>No expense data for this period.</p>
      </div>
    )
  }

  let currentAngle = 0
  const segments = categories.map(([category, amount], index) => {
    const start = currentAngle
    const end = currentAngle + (amount / total) * 360
    currentAngle = end

    return {
      category,
      amount,
      color: palette[index % palette.length],
      start,
      end,
    }
  })

  const gradient = segments
    .map((segment) => `${segment.color} ${segment.start}deg ${segment.end}deg`)
    .join(', ')

  return (
    <div className="chart-card">
      <div className="section-header compact-header">
        <h3>Expense by category</h3>
      </div>

      <div className="donut-panel">
        <div className="donut-chart" style={{ background: `conic-gradient(${gradient})` }}>
          <div className="donut-center">
            <strong>{formatCurrency(total)}</strong>
            <span>Total</span>
          </div>
        </div>

        <ul className="legend-list">
          {segments.map((segment) => (
            <li key={segment.category}>
              <span className="legend-swatch" style={{ background: segment.color }} />
              <span>{segment.category}</span>
              <strong>{formatCurrency(segment.amount)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ExpensePieChart
