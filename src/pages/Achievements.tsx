import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Trophy, Star, BookOpen, Map, Lock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const iconMap: Record<string, any> = {
  Trophy,
  Star,
  BookOpen,
  Map,
};

export function Achievements() {
  const { achievements, quizResults, sessions } = useAppStore();

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;
  
  const averageScore = quizResults.length > 0 
    ? Math.round(quizResults.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / quizResults.length * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Achievements</h1>
        <p className="text-slate-400">Track your learning milestones and badges.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Badges Unlocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-400">{unlockedCount} <span className="text-2xl text-slate-600">/ {totalCount}</span></div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Average Quiz Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-400">{averageScore}%</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Lessons Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-400">{sessions.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {achievements.map((achievement) => {
          const Icon = iconMap[achievement.icon] || Trophy;
          const isUnlocked = !!achievement.unlockedAt;
          
          return (
            <Card 
              key={achievement.id} 
              className={`border-slate-800 backdrop-blur-xl transition-all ${
                isUnlocked ? 'bg-slate-900/80' : 'bg-slate-950/50 opacity-60 grayscale'
              }`}
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className={`p-4 rounded-2xl ${isUnlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                  {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-100">{achievement.title}</h3>
                  <p className="text-sm text-slate-400">{achievement.description}</p>
                  {isUnlocked && achievement.unlockedAt && (
                    <p className="text-xs text-indigo-400/80 pt-2">
                      Unlocked on {format(parseISO(achievement.unlockedAt), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
