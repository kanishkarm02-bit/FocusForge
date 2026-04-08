import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

const ONBOARDING_STEPS = [
  {
    title: "Welcome to FocusForge",
    description: "Your personalized Texas TEKS learning platform. Let's take a quick tour of how things work.",
  },
  {
    title: "Learn",
    description: "Choose your grade level and core subjects to get a personalized curriculum of study modules aligned with Texas standards.",
  },
  {
    title: "AI-Powered Lessons",
    description: "Select a module to generate a custom lesson complete with an article, video recommendations, and a quiz to test your knowledge.",
  },
  {
    title: "Achievements & Analytics",
    description: "Earn badges for perfect scores and track your learning progress over time.",
  }
];

export function Onboarding() {
  const { hasSeenOnboarding, completeOnboarding } = useAppStore();
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenOnboarding) {
      // Small delay to let the UI render first
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenOnboarding]);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setIsOpen(false);
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    completeOnboarding();
  };

  if (hasSeenOnboarding) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-xl text-indigo-400">
            {ONBOARDING_STEPS[step].title}
          </DialogTitle>
          <DialogDescription className="text-slate-400 pt-4 text-base">
            {ONBOARDING_STEPS[step].description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-2 py-4">
          {ONBOARDING_STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-700'}`}
            />
          ))}
        </div>

        <DialogFooter className="flex sm:justify-between items-center mt-4">
          <Button variant="ghost" onClick={handleSkip} className="text-slate-400 hover:text-slate-200">
            Skip Tour
          </Button>
          <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {step === ONBOARDING_STEPS.length - 1 ? "Get Started" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
