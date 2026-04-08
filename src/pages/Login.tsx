import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { BookOpen } from 'lucide-react';

export function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() && password.trim()) {
      login(name.trim());
      navigate('/app/learn');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Chalkboard texture overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <Card className="w-full max-w-md bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto bg-indigo-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
            <BookOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-100">FocusForge</CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Forge your focus. Master your mind.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Student Name</Label>
              <Input
                id="name"
                placeholder="e.g. Alex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500 h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500 h-12"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg transition-colors"
            >
              Enter Classroom
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
