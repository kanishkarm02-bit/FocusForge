import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO, subDays, isToday, isThisWeek } from 'date-fns';
import { Progress } from '../components/ui/progress';

export function Analytics() {
  const { sessions, settings, tasks, quizResults } = useAppStore();

  // Aggregate data for the last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      dateStr: format(d, 'yyyy-MM-dd'),
      displayDate: format(d, 'EEE'),
      lessonsCompleted: 0,
      tasksCompleted: 0,
    };
  });

  sessions.forEach(session => {
    const sessionDateStr = session.date.split('T')[0];
    const day = last7Days.find(d => d.dateStr === sessionDateStr);
    if (day) {
      day.lessonsCompleted += 1;
    }
  });

  tasks.forEach(task => {
    if (task.completed && task.completedAt) {
      const taskDateStr = task.completedAt.split('T')[0];
      const day = last7Days.find(d => d.dateStr === taskDateStr);
      if (day) {
        day.tasksCompleted += 1;
      }
    }
  });

  const totalLessons = sessions.length;

  const goalType = settings.goalType || 'daily';
  const goalLessons = goalType === 'daily' ? 2 : 10; // Mock goal for lessons instead of minutes

  const currentGoalProgress = sessions
    .filter(s => goalType === 'daily' ? isToday(parseISO(s.date)) : isThisWeek(parseISO(s.date), { weekStartsOn: 1 }))
    .length;

  const goalPercentage = Math.min(100, Math.round((currentGoalProgress / goalLessons) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Analytics</h1>
        <p className="text-slate-400">Review your study progress and habits.</p>
      </div>

      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-slate-100">
            {goalType === 'daily' ? 'Daily' : 'Weekly'} Lesson Goal
          </CardTitle>
          <CardDescription className="text-slate-400">
            {currentGoalProgress} / {goalLessons} lessons completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-indigo-400 font-medium">{goalPercentage}%</span>
            </div>
            <Progress value={goalPercentage} className="h-3 bg-slate-800" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-100">Lessons Completed (Last 7 Days)</CardTitle>
            <CardDescription className="text-slate-400">Number of lessons finished per day</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="displayDate" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                />
                <Bar dataKey="lessonsCompleted" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-100">Tasks Completed (Last 7 Days)</CardTitle>
            <CardDescription className="text-slate-400">Tasks finished per day</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="displayDate" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                />
                <Line type="monotone" dataKey="tasksCompleted" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-slate-100">Recent Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          {quizResults.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No quizzes taken yet. Complete a lesson!</p>
          ) : (
            <div className="space-y-4">
              {[...quizResults].reverse().slice(0, 5).map(result => (
                <div key={result.id} className="flex justify-between items-center p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div>
                    <p className="font-medium text-slate-200">{result.topic}</p>
                    <p className="text-sm text-slate-500">{format(parseISO(result.date), 'MMM d, yyyy - h:mm a')}</p>
                  </div>
                  <div className={`font-bold text-lg ${result.score === result.total ? 'text-emerald-400' : 'text-indigo-400'}`}>
                    {Math.round((result.score / result.total) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
