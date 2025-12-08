'use client';

import { useState } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import GoalsGrid from '@/components/GoalsGrid';
import GoalSubmissionModal from '@/components/GoalSubmissionModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setShowSuccess(true);
    setRefreshKey(prev => prev + 1); // Trigger grid refresh
    
    // Hide toast after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <main className="min-h-screen bg-off-white">
      {/* Fixed Add Goal Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-6 right-6 z-40 bg-charcoal text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        title="Add your goal"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 fade-in">
          <CheckCircle size={20} />
          <span className="font-medium">Goal saved! Check your email for confirmation.</span>
        </div>
      )}

      {/* Main Content Container */}
      <div className="flex flex-col items-center w-full">
        {/* Hero Section - 50vh */}
        <section className="h-[50vh] flex items-center justify-center px-4 relative overflow-hidden w-full">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-platinum/20 to-transparent pointer-events-none" />
          
          <div className="text-center max-w-3xl mx-auto relative z-10 fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal mb-6">
              FutureNote
            </h1>
            <p className="text-xl md:text-2xl text-charcoal-light font-light">
              Set it once and commit yourself.
            </p>
            <p className="text-base md:text-lg text-charcoal-light mt-4 max-w-xll mx-auto">
              Write your 4-year goal today. We&apos;ll remind you when it&apos;s time to reflect.
            </p>
            
          </div>
        </section>

        {/* Goals Grid Section */}
        <section className="max-w-7xl w-full px-4 pb-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold text-charcoal mb-2">
              Public Goals
            </h2>
            <p className="text-charcoal-light">
              Be inspired by what others are working towards
            </p>
          </div>

          <GoalsGrid key={refreshKey} />
        </section>
      </div>

      {/* Goal Submission Modal */}
      <GoalSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </main>
  );
}
