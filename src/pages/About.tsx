import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Target, Sparkles, Award } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
          FocusForge
        </h1>
        <p className="text-2xl font-medium text-slate-200 italic">
          "Master the TEKS, ace the test, FocusForge outshines the rest!"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100 flex items-center gap-2">
              <Sparkles className="text-indigo-400" />
              What is FocusForge?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4 leading-relaxed">
            <p>
              FocusForge is a next-generation, AI-powered learning platform built specifically for Texas students. 
              We believe that every student learns differently, and standard textbooks don't always cut it. 
              That's why we've created a dynamic educational hub that adapts to your grade level and subject needs.
            </p>
            <p>
              Whether you're tackling 3rd-grade reading or 8th-grade science, FocusForge generates personalized, 
              engaging lessons on demand, ensuring you have the exact resources you need to succeed.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
              <Target className="text-emerald-400" />
              TEKS-Aligned Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            <p>
              Our curriculum is strictly aligned with the <strong>Texas Essential Knowledge and Skills (TEKS)</strong>. 
              Every module, article, and quiz is designed to help you master the specific standards required by the state of Texas, 
              giving you confidence in the classroom and on standardized tests.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
              <BookOpen className="text-amber-400" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Select your path:</strong> Choose your grade (1st-12th) and core subject.</li>
              <li><strong>Generate lessons:</strong> Our AI crafts custom articles, video recommendations, and quizzes.</li>
              <li><strong>Test your knowledge:</strong> Take interactive quizzes to reinforce what you've learned.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
              <Award className="text-purple-400" />
              Track Your Success
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            <p>
              Learning should be rewarding! FocusForge tracks your daily and weekly progress through our comprehensive analytics dashboard. 
              As you complete lessons and ace quizzes, you'll unlock exclusive badges and achievements. Set your goals, build a study habit, 
              and watch your knowledge grow.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
