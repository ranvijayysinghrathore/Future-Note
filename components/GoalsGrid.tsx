import { useEffect, useState } from 'react';
import { Flag } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const handleReport = async (goalId: string) => {
    if (!confirm('Report this goal as inappropriate?')) return;

    try {
      const response = await fetch('/api/goals/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, reason: 'User reported' }),
      });

      if (response.ok) {
        alert('Thank you for reporting. We will review this goal.');
      }
    } catch (error) {
      console.error('Error reporting goal:', error);
    }
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
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            variants={item}
            className="h-full"
          >
            <div className="card group relative flex flex-col h-full bg-white/50 backdrop-blur-md border border-white/50 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-lg">
              {/* Report button */}
              <button
                onClick={() => handleReport(goal.id)}
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
    </div>
  );
}
