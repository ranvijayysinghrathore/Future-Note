'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Flag, Trash2 } from 'lucide-react'

interface Report {
  id: string
  reason: string
  reportedAt: string
  resolved: boolean
  goal: {
    id: string
    goalText: string
    isFlagged: boolean
    isDeleted: boolean
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [filter, page])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/reports?filter=${filter}&page=${page}`)
      const data = await res.json()
      setReports(data.reports)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (reportId: string) => {
    try {
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action: 'resolve' }),
      })
      fetchReports()
    } catch (error) {
      console.error('Failed to resolve report:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-charcoal mb-8">Reports</h1>

      <div className="flex gap-2 mb-6">
        {['all', 'unresolved', 'resolved'].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f)
              setPage(1)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-charcoal text-white'
                : 'bg-white text-charcoal-light hover:bg-off-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-platinum"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="text-sm text-charcoal-light mb-2">
                  Reported on {new Date(report.reportedAt).toLocaleDateString()}
                </p>
                <p className="text-charcoal font-medium mb-2">Reason: {report.reason}</p>
                <p className="text-charcoal bg-off-white p-4 rounded-lg">
                  {report.goal.goalText}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                {report.goal.isFlagged && (
                  <Flag size={20} className="text-orange-600" />
                )}
                {report.goal.isDeleted && (
                  <Trash2 size={20} className="text-red-600" />
                )}
                {report.resolved && (
                  <CheckCircle size={20} className="text-green-600" />
                )}
              </div>
            </div>

            {!report.resolved && (
              <button
                onClick={() => handleResolve(report.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
