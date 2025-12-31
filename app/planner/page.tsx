'use client';

import React from 'react';
import MeshGradient from '@/components/MeshGradient';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

const PlannerPage = () => {
  return (
    <main className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <MeshGradient isFullPage={true} />

      <div className="max-w-4xl w-full text-center relative z-10 flex flex-col justify-center items-center">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-charcoal/5 border border-charcoal/10 backdrop-blur-md mb-8"
        >
          <Sparkles size={16} className="text-black animate-pulse" />
          <span className="text-xs font-bold tracking-widest uppercase text-black/60">Coming Soon</span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold text-charcoal mb-8 tracking-tighter font-playfair"
        >
          Your Personal <br />
          <span className="bg-gradient-to-r from-[#7a73ff] via-[#00d1ff] to-[#ff5858] bg-clip-text text-transparent">AI Goal Architect</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs md:text-sm text-charcoal/50 mb-12 max-w-lg mx-auto leading-relaxed tracking-wide"
        >
          Don't just set goals. Deconstruct them. <br className="hidden md:block" />
          Our AI breaks your vision into achievable daily steps, 
          keeps you accountable, and helps you win 2026.
        </motion.p>

        {/* Call to Action */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.7 }}
           className="flex flex-col items-center justify-center gap-6 mt-4"
        >
          <Link href="/" className="text-charcoal/40 font-semibold hover:text-charcoal transition-colors text-sm underline decoration-charcoal/20 underline-offset-4">
            Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Floating Orbs for extra premium vibe */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-200/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </main>
  );
};

export default PlannerPage;
