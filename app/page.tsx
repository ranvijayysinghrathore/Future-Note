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
    <main className="min-h-screen bg-off-white relative overflow-hidden">
      {/* Mesh Gradients - Global Background (Subtle Off-White/Warm) */}
      <div className="absolute top-[-10%] left-[-20%] w-[1200px] h-[1200px] bg-amber-50/20 rounded-full blur-[180px]  pointer-events-none fixed" />
      <div className="absolute top-[20%] right-[-20%] w-[1000px] h-[1000px] bg-stone-100/40 rounded-full blur-[180px]  delay-700 pointer-events-none fixed" />
      <div className="absolute bottom-[-10%] left-[10%] w-[1400px] h-[1400px] bg-orange-50/30 rounded-full blur-[180px]  delay-1000 pointer-events-none fixed" />

      {/* Header Buttons */}
      <div className="fixed top-6 right-6 z-40 flex gap-3">
        {/* Achievers Button */}
        {/* <a
          href="/achievers"
          className="bg-white text-charcoal px-3 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold border-2 border-charcoal flex items-center gap-2 text-sm"
          title="View Achievers"
        >
          <span className="text-base">🏆</span>
        </a> */}

        {/* Add Goal Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed top-6 right-6 z-40 bg-charcoal text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
          title="Add your goal"
        >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 fade-in">
          <CheckCircle size={20} />
          <span className="font-medium">Goal saved! Check your email for confirmation.</span>
        </div>
      )}

      {/* Main Content Container */}
      <div className="flex flex-col items-center w-full relative z-10">
        <section className="h-[50vh] flex items-center justify-center px-4 relative w-full">
          
          <div className="text-center max-w-3xl mx-auto relative z-10 fade-in">
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold text-charcoal mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              FutureNote
            </h1>
            <p className="text-sm md:text-base text-charcoal/60 uppercase tracking-widest mb-8 font-medium">
              Set it once and commit yourself
            </p>
            <p className="text-lg md:text-xl text-charcoal-light max-w-2xl mx-auto leading-relaxed">
              Write your 4-year goal today. We&apos;ll remind you when it&apos;s time to reflect.
            </p>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 animate-bounce opacity-50">
               <span className="text-2xl">↓</span>
            </div>
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

      {/* Grounding Footer */}
      <footer className="w-full py-12 text-center relative z-10 opacity-60">
        <p className="text-xs font-semibold tracking-widest text-charcoal uppercase mb-2">
          FutureNote
        </p>
        <p className="text-[10px] text-charcoal-light">
          © {new Date().getFullYear()} • Crafted for your future self
        </p>
      </footer>

      {/* Goal Submission Modal */}
      <GoalSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </main>
  );
}
