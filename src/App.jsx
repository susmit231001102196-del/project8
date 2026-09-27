import { useEffect, useMemo, useState } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseSummary from './components/ExpenseSummary'
import ExpensePieChart from './components/charts/ExpensePieChart'
import IncomeExpenseBarChart from './components/charts/IncomeExpenseBarChart'
import DailyTrendLineChart from './components/charts/DailyTrendLineChart'
import './App.css'

const STORAGE_KEY = 'expense-tracker-v1'

const createSeedEntries = () => {
  const today = new Date()

  const formatDate = (monthOffset, day) => {
    const date = new Date(today.getFullYear(), today.getMonth() + monthOffset, day)
    return date.toISOString().slice(0, 10)
  }

  return [
    { id: 1, title: 'Salary', category: 'Salary', amount: 4200, type: 'income', date: formatDate(0, 1) },
    { id: 2, title: 'Freelance Project', category: 'Freelance', amount: 700, type: 'income', date: formatDate(0, 12) },
    { id: 3, title: 'Groceries', category: 'Food', amount: 180, type: 'expense', date: formatDate(0, 3) },
    { id: 4, title: 'Rent', category: 'Housing', amount: 1500, type: 'expense', date: formatDate(0, 5) },
    { id: 5, title: 'Fuel', category: 'Transport', amount: 80, type: 'expense', date: formatDate(0, 8) },
    { id: 6, title: 'Electric Bill', category: 'Utilities', amount: 120, type: 'expense', date: formatDate(0, 14) },
    { id: 7, title: 'Movie Night', category: 'Entertainment', amount: 45, type: 'expense', date: formatDate(0, 18) },
    { id: 8, title: 'Bonus', category: 'Bonus', amount: 350, type: 'income', date: formatDate(-1, 28) },
    { id: 9, title: 'Dining Out', category: 'Food', amount: 65, type: 'expense', date: formatDate(-1, 15) },
    { id: 10, title: 'Train Pass', category: 'Transport', amount: 110, type: 'expense', date: formatDate(-1, 10) },
    { id: 11, title: 'Cloud Subscription', category: 'Utilities', amount: 20, type: 'expense', date: formatDate(-2, 5) },
  ]
}

function App() {
  const [entries, setEntries] = useState(() => {
    try {
      const storedEntries = localStorage.getItem(STORAGE_KEY)

      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries)

        if (Array.isArray(parsedEntries) && parsedEntries.length > 0) {
          return parsedEntries
        }
      }
    } catch (error) {
      console.error('Unable to read saved entries', error)
    }

    return createSeedEntries()
  })

  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const monthlyEntries = useMemo(
    () => entries.filter((entry) => entry.date.startsWith(selectedMonth)),
    [entries, selectedMonth],
  )

  const categories = useMemo(
    () => [...new Set(entries.map((entry) => entry.category))].sort((a, b) => a.localeCompare(b)),
    [entries],
  )

  const handleAddEntry = (entry) => {
    const normalizedEntry = {
      ...entry,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      amount: Number(entry.amount),
    }

    setEntries((previousEntries) => [normalizedEntry, ...previousEntries])
    setSelectedMonth(entry.date.slice(0, 7))
  }

  const handleDelete = (id) => {
    setEntries((previousEntries) => previousEntries.filter((entry) => entry.id !== id))
  }

  const handleExportCsv = () => {
    const rows = [
      ['Title', 'Category', 'Type', 'Amount', 'Date'],
      ...monthlyEntries.map((entry) => [entry.title, entry.category, entry.type, entry.amount, entry.date]),
    ]

    const csvContent = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `budget-${selectedMonth}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Cashflow dashboard</p>
          <h1>Expense Tracker</h1>
        </div>

        <label className="month-picker">
          <span>Month</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
          />
        </label>
      </header>

      <div className="main-grid">
        <section className="panel panel-wide">
          <ExpenseForm onSubmit={handleAddEntry} />
        </section>

        <section className="panel panel-summary">
          <ExpenseSummary entries={monthlyEntries} month={selectedMonth} onExportCsv={handleExportCsv} />
        </section>
      </div>

      <div className="chart-grid">
        <section className="panel">
          <ExpensePieChart entries={monthlyEntries} />
        </section>

        <section className="panel">
          <IncomeExpenseBarChart entries={entries} />
        </section>
      </div>

      <section className="panel">
        <ExpenseList
          entries={monthlyEntries}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onDelete={handleDelete}
        />
      </section>

      <section className="panel">
        <DailyTrendLineChart entries={monthlyEntries} month={selectedMonth} />
      </section>
    </div>
  )
}

export default App
