'use client';

import { useState } from 'react';
import { X, ArrowRight, Check, ChevronLeft, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GoalSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoalSubmissionModal({ isOpen, onClose, onSuccess }: GoalSubmissionModalProps) {
  const [step, setStep] = useState<'input' | 'confirm' | 'final'>('input');
  const [goalText, setGoalText] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (goalText.length < 10) {
      setError('Goal must be at least 10 characters long');
      return;
    }
    
    setStep('confirm');
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/goals/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalText, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit goal');
      }

      // Reset and close
      setGoalText('');
      setEmail('');
      setStep('input');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setGoalText('');
    setEmail('');
    setError('');
    setStep('input');
    onClose();
  };

  const steps = {
    input: <InputStep 
      goalText={goalText} 
      setGoalText={setGoalText} 
      email={email} 
      setEmail={setEmail} 
      error={error} 
      onSubmit={handleInitialSubmit}
    />,
    confirm: <ConfirmStep 
      goalText={goalText} 
      onBack={() => setStep('input')} 
      onConfirm={() => setStep('final')} 
    />,
    final: <FinalStep 
      email={email} 
      loading={loading} 
      error={error} 
      onBack={() => setStep('input')} 
      onConfirm={handleFinalSubmit} 
    />
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header/Close Button */}
            <div className="flex items-center justify-between p-6 pb-0">
               <div className="flex gap-2">
                  <div className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-300", step === 'input' ? "bg-red-500" : "bg-platinum")} />
                  <div className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-300", step === 'confirm' ? "bg-yellow-500" : "bg-platinum")} />
                  <div className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-300", step === 'final' ? "bg-green-500" : "bg-platinum")} />
               </div>
              <button
                onClick={handleClose}
                className="text-charcoal-light hover:text-charcoal hover:bg-off-white p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Container - Animates height */}
            <motion.div 
              layout 
              className="p-6 pt-2"
            >
               <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                     {steps[step]}
                  </motion.div>
               </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Sub-components for cleaner file
interface InputStepProps {
  goalText: string;
  setGoalText: (text: string) => void;
  email: string;
  setEmail: (email: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

function InputStep({ goalText, setGoalText, email, setEmail, error, onSubmit }: InputStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-charcoal">Set Your <span className="text-charcoal bg-clip-text bg-gradient-to-r from-charcoal to-charcoal-light">4-Year Goal</span></h2>
        <p className="text-charcoal-light text-sm">Design your future. We&apos;ll keep it safe.</p>
      </div>

      <div className="space-y-4">
        <div className="group">
         <label htmlFor="goalText" className="block text-sm font-semibold text-charcoal mb-2 ml-1">Your Vision</label>
          <div className="relative">
             <textarea
               id="goalText"
               value={goalText}
               onChange={(e) => setGoalText(e.target.value)}
               placeholder="In 4 years, I will be..."
               className="w-full p-4 rounded-xl bg-off-white border-2 border-transparent focus:border-charcoal/10 focus:bg-white transition-all duration-300 outline-none resize-none h-40 text-lg leading-relaxed shadow-inner placeholder:text-gray-400"
               maxLength={500}
               required
             />
             <div className="absolute bottom-3 right-3 text-xs font-medium text-charcoal-light/50 bg-off-white/50 px-2 py-1 rounded">
               {goalText.length}/500
             </div>
          </div>
          {goalText.length > 0 && goalText.length < 10 && (
             <p className="text-xs text-red-500 mt-1 ml-1">Just a bit more detail...</p>
          )}
        </div>

        <div>
         <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2 ml-1">Email for Reminder</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-4 rounded-xl bg-off-white border-2 border-transparent focus:border-charcoal/10 focus:bg-white transition-all duration-300 outline-none shadow-inner font-medium placeholder:text-gray-400"
            required
          />
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {error}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={goalText.length < 10}
        className="w-full py-4 bg-charcoal text-white rounded-xl font-semibold text-lg hover:bg-black hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none transition-all duration-300 flex items-center justify-center gap-2 group"
      >
        Continue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
}

interface ConfirmStepProps {
  goalText: string;
  onBack: () => void;
  onConfirm: () => void;
}

function ConfirmStep({ goalText, onBack, onConfirm }: ConfirmStepProps) {
   return (
      <div className="space-y-6">
         <div className="space-y-2">
           <h2 className="text-3xl font-bold text-charcoal">Are you <span className="italic font-serif">sure?</span></h2>
           <p className="text-charcoal-light text-sm">Read it aloud. Does it feel right?</p>
         </div>

         <div className="bg-gradient-to-br from-off-white to-platinum/30 p-8 rounded-2xl relative overflow-hidden group border border-platinum">
            <div className="absolute top-0 left-0 w-1 h-full bg-charcoal" />
            <Flag className="absolute -right-4 -top-4 text-platinum h-24 w-24 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            <p className="text-charcoal text-xl italic font-serif leading-loose relative z-10">
               "{goalText}"
            </p>
         </div>

         <div className="flex gap-3 pt-4">
            <button
               onClick={onBack}
               className="flex-1 py-3 px-4 rounded-xl border border-platinum text-charcoal font-medium hover:bg-off-white transition-colors flex items-center justify-center gap-2"
            >
               <ChevronLeft size={18} /> Edit
            </button>
            <button
               onClick={onConfirm}
               className="flex-[2] py-3 px-4 bg-charcoal text-white rounded-xl font-medium hover:bg-black hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
               Yes, Lock It In <Check size={18} />
            </button>
         </div>
      </div>
   )
}

interface FinalStepProps {
  email: string;
  loading: boolean;
  error: string;
  onBack: () => void;
  onConfirm: () => void;
}

function FinalStep({ email, loading, error, onBack, onConfirm }: FinalStepProps) {
  return (
    <div className="space-y-6">
       <div className="text-center space-y-2 py-4">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", delay: 0.2 }}
            className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100"
          >
             <Flag size={32} />
          </motion.div>
          <h2 className="text-3xl font-bold text-charcoal">Final Commitment</h2>
          <p className="text-charcoal-light">Sending to your future self at <span className="font-semibold text-charcoal">{email}</span></p>
       </div>

      <div className="bg-off-white/50 p-4 rounded-xl text-center border border-dashed border-gray-200">
         <p className="text-sm text-charcoal-light">
            You won&apos;t be able to edit this once submitted. This is a promise to yourself.
         </p>
      </div>

       {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
            {error}
        </motion.div>
      )}

      <div className="flex gap-3 pt-2">
         <button
            onClick={onBack}
            disabled={loading}
            className="flex-1 py-4 rounded-xl text-charcoal-light font-medium hover:text-charcoal hover:bg-off-white transition-colors"
         >
            Back
         </button>
         <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-[2] py-4 bg-charcoal text-white rounded-xl font-bold text-lg hover:bg-black hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
         >
            {loading ? (
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full" />
               </motion.div>
            ) : (
               <>Confirm Goal <ArrowRight size={20} /></>
            )}
         </button>
      </div>
    </div>
  );
}
