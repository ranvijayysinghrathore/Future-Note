import { useEffect, useState, useCallback } from 'react';
import { Flag, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Goal {
  id: string;
  goalText: string;
  createdAt: string;
  userName: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function GoalsGrid() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showReportToast, setShowReportToast] = useState(false);
  const [confirmingGoalId, setConfirmingGoalId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`/api/goals?page=${page}&limit=12`);
        
        if (!response.ok) {
          console.error('Failed to fetch goals:', response.status);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        
        if (data.goals) {
          setGoals(prev => page === 1 ? data.goals : [...prev, ...data.goals]);
          setHasMore(data.hasMore);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const executeReport = async (goalId: string) => {
    setConfirmingGoalId(null);
    try {
      const response = await fetch('/api/goals/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, reason: 'User reported' }),
      });

      if (response.ok) {
        setShowReportToast(true);
        setTimeout(() => setShowReportToast(false), 4000);
      }
    } catch (error) {
      console.error('Error reporting goal:', error);
    }
  };

  const handleReportClick = (goalId: string) => {
    setConfirmingGoalId(goalId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-charcoal-light">
          No goals yet. Be the first to set yours!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Goals Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            variants={item}
            className="h-full"
          >
            <div className="card group relative flex flex-col h-full bg-white/50 backdrop-blur-md border border-white/50 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-lg">
              {/* Report button */}
              <button
                onClick={() => handleReportClick(goal.id)}
                className="absolute top-1 right-1 group-hover:opacity-100 transition-opacity text-charcoal-light hover:text-red-500 z-20"
                title="Report inappropriate content"
              >
                <Flag size={16} />
              </button>

              {/* User Name */}
              <p className="text-xs font-semibold text-charcoal mb-2">
                {goal.userName}
              </p>

              {/* Goal text */}
              <p className="text-charcoal leading-relaxed flex-grow">
                &gt; {goal.goalText}
              </p>

              {/* Date */}
              <p className="text-xs text-charcoal-light mt-auto pt-4">
                {new Date(goal.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="btn btn-secondary"
          >
            Load More Goals
          </button>
        </div>
      )}

      {/* Report Confirmation Modal */}
      <AnimatePresence>
        {confirmingGoalId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/20 backdrop-blur-sm"
              onClick={() => setConfirmingGoalId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-platinum"
            >
              <div className="flex items-center gap-3 mb-4 text-red-500">
                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Flag size={20} />
                </div>
                <h3 className="font-bold text-lg text-charcoal">Report Goal?</h3>
              </div>
              <p className="text-charcoal-light text-sm mb-6 leading-relaxed">
                Are you sure you want to report this goal for inappropriate content? Our team will review it.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmingGoalId(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-platinum bg-white text-charcoal font-medium hover:bg-off-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeReport(confirmingGoalId)}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                >
                  Yes, Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Jaw-Dropping Report Toast */}
      <AnimatePresence>
        {showReportToast && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[120] w-[calc(100%-3rem)] max-w-sm"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white p-1 shadow-[0_30px_90px_rgba(79,70,229,0.25)] ring-1 ring-black/5">
              <div className="relative bg-white rounded-[1.4rem] p-6 flex items-center gap-5">
                {/* Vibrant Gradient Orb Background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full" />
                
                {/* Icon with Electric Glow */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 animate-pulse" />
                  <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                     <ShieldCheck size={32} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h4 className="text-gray-900 font-extrabold text-xl tracking-tight mb-0.5">Report Received</h4>
                  <p className="text-gray-500 text-[15px] font-medium leading-relaxed">
                    Flagged for review. Stay safe.
                  </p>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setShowReportToast(false)}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all p-2 rounded-xl"
                >
                  <X size={20} />
                </button>

                {/* Animated Thick Progress Bar */}
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-600"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
