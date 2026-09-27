function DailyTrendLineChart({ entries, month }) {
  if (!month) {
    return null
  }

  const [year, monthNumber] = month.split('-').map(Number)
  const totalDays = new Date(year, monthNumber, 0).getDate()

  const dailyData = Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1
    const dayKey = `${month}-${String(day).padStart(2, '0')}`

    return {
      day,
      value: entries
        .filter((entry) => entry.date === dayKey)
        .reduce((total, entry) => {
          const amount = Number(entry.amount)
          return entry.type === 'income' ? total + amount : total - amount
        }, 0),
    }
  })

  const values = dailyData.map((day) => day.value)
  const minValue = Math.min(0, ...values)
  const maxValue = Math.max(0, ...values)
  const chartHeight = 120
  const chartBottom = 170

  const points = dailyData.map((day, index) => {
    const x = 35 + (index * 330) / Math.max(dailyData.length - 1, 1)
    const range = maxValue - minValue || 1
    const y = chartBottom - ((day.value - minValue) / range) * chartHeight
    return { ...day, x, y }
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 35} ${chartBottom} L ${points[0]?.x ?? 35} ${chartBottom} Z`

  if (points.length === 0) {
    return (
      <div className="chart-card empty-chart">
        <h3>Daily trend</h3>
        <p>No items for this month yet.</p>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <div className="section-header compact-header">
        <h3>Daily trend</h3>
      </div>

      <svg viewBox="0 0 380 210" role="img" aria-label="Daily spending trend chart">
        <line x1="35" y1="170" x2="350" y2="170" className="axis-line" />
        <line x1="35" y1="30" x2="35" y2="170" className="axis-line" />
        <path d={areaPath} fill="rgba(139, 92, 246, 0.18)" />
        <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />

        {points.map((point) => (
          <circle key={point.day} cx={point.x} cy={point.y} r="3" fill="#8b5cf6" />
        ))}
      </svg>
    </div>
  )
}

export default DailyTrendLineChart
