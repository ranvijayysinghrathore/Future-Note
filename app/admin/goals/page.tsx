'use client'

import { useState, useEffect } from 'react'
import { Trash2, Flag, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

interface Goal {
  id: string
  goalText: string
  createdAt: string
  isPublic: boolean
  isFlagged: boolean
  isDeleted: boolean
  reminderSent: boolean
  achieved: boolean | null
}

export default function GoalsManagementPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGoals()
  }, [filter, page])

  const fetchGoals = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/goals?filter=${filter}&page=${page}`)
      const data = await res.json()
      setGoals(data.goals)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      await fetch('/api/admin/goals', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId }),
      })
      fetchGoals()
    } catch (error) {
      console.error('Failed to delete goal:', error)
    }
  }

  const handleFlag = async (goalId: string, action: 'flag' | 'unflag') => {
    try {
      await fetch('/api/admin/goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, action }),
      })
      fetchGoals()
    } catch (error) {
      console.error('Failed to flag goal:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-charcoal mb-8">Goals Management</h1>

      <div className="flex gap-2 mb-6">
        {['all', 'public', 'flagged', 'deleted'].map((f) => (
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

      <div className="bg-white rounded-xl shadow-sm border border-platinum overflow-hidden">
        <table className="w-full">
          <thead className="bg-off-white">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-charcoal">Goal</th>
              <th className="text-left p-4 text-sm font-semibold text-charcoal">Date</th>
              <th className="text-left p-4 text-sm font-semibold text-charcoal">Status</th>
              <th className="text-right p-4 text-sm font-semibold text-charcoal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id} className="border-t border-platinum">
                <td className="p-4">
                  <p className="text-charcoal line-clamp-2">{goal.goalText}</p>
                </td>
                <td className="p-4 text-sm text-charcoal-light">
                  {new Date(goal.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {goal.isPublic ? (
                      <Eye size={16} className="text-green-600" />
                    ) : (
                      <EyeOff size={16} className="text-gray-400" />
                    )}
                    {goal.isFlagged && <Flag size={16} className="text-orange-600" />}
                    {goal.isDeleted && <Trash2 size={16} className="text-red-600" />}
                    {goal.achieved === true && <CheckCircle size={16} className="text-green-600" />}
                    {goal.achieved === false && <XCircle size={16} className="text-gray-400" />}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    {!goal.isDeleted && (
                      <>
                        <button
                          onClick={() => handleFlag(goal.id, goal.isFlagged ? 'unflag' : 'flag')}
                          className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Flag size={16} className={goal.isFlagged ? 'text-orange-600' : 'text-gray-400'} />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
