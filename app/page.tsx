'use client';

import { useState } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <main className="min-h-screen relative overflow-hidden">
      {/* Mesh background is provided by RootLayout */}

      {/* Header Buttons */}
      <div className="fixed top-6 right-6 z-40">
        {/* Add Goal Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-charcoal text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
          title="Add your goal"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white p-1 shadow-[0_30px_90px_rgba(34,197,94,0.15)] ring-1 ring-black/5">
              <div className="relative bg-white rounded-[1.4rem] p-5 flex items-center gap-4">
                {/* Text Content */}
                <div className="flex-1">
                  <h4 className="text-gray-900 font-bold text-lg tracking-tight">Goal Saved!</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    Check your email for confirmation.
                  </p>
                </div>

                {/* Animated Progress Bar */}
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-green-500 to-emerald-600"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Container */}
      <div className="flex flex-col items-center w-full relative z-10">
        <section className="h-[60vh] flex items-center justify-center px-4 relative w-full overflow-visible">
          
          {/* Floating Elements (Background) */}
          <div className="absolute top-[12%] left-[3%] md:left-[10%] hover:scale-110 transition-transform duration-500 cursor-pointer hidden sm:block animate-float">
              <div className="bg-gradient-to-br from-[#FFB800] to-[#FF8A00] text-white w-28 h-20 md:w-40 md:h-28 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] transform -rotate-12 shadow-[0_20px_50px_rgba(255,184,0,0.3)] flex flex-col items-center justify-center hover:shadow-[0_30px_60px_rgba(255,184,0,0.4)] transition-all border-2 border-white/30 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="font-bold text-lg md:text-xl tracking-tighter font-playfair drop-shadow-md">LOCK IN</span>
              </div>
          </div>

          <div className="absolute bottom-[18%] right-[3%] md:right-[10%] hover:scale-110 transition-transform duration-500 cursor-pointer hidden sm:block animate-float-delayed">
              <div className="bg-gradient-to-br from-[#00D1FF] to-[#007AFF] text-white w-32 h-24 md:w-44 md:h-32 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] transform rotate-6 shadow-[0_20px_50px_rgba(0,209,255,0.3)] flex flex-col items-center justify-center hover:shadow-[0_30px_60px_rgba(0,209,255,0.4)] transition-all border-2 border-white/30 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="font-bold text-xl md:text-3xl tracking-tighter font-playfair drop-shadow-md">2026</span>
              </div>
          </div>



          <div className="text-center max-w-4xl mx-auto relative z-10 fade-in px-4">
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold text-charcoal mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              FutureNote
            </h1>
            <p className="text-sm md:text-base text-charcoal/60 uppercase tracking-widest mb-8 font-medium">
              Lock in your 2026 Goal
            </p>
            <p className="text-base md:text-lg text-charcoal-light/80 max-w-xl mx-auto leading-relaxed opacity-0 animate-[slideUp_1s_ease-out_0.5s_forwards]">
              Write your goal for 2026. <br className="hidden md:block"/> We&apos;ll remind you on <span className="text-charcoal decoration-1 decoration-orange-400/50 underline-offset-4">Dec 31st</span> to see if you achieved it.
            </p>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 animate-bounce opacity-50">
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
