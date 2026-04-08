import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Button } from '../components/ui/button';

export function Settings() {
  const { settings, updateSettings } = useAppStore();

  const goalType = settings.goalType || 'daily';
  const goalLessons = settings.goalMinutes || 2; // Repurposing goalMinutes for goalLessons for now
  const maxGoal = goalType === 'daily' ? 10 : 50;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400">Manage your learning preferences.</p>
      </div>

      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-slate-100">Learning Goals</CardTitle>
          <CardDescription className="text-slate-400">Set a target for lessons completed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base text-slate-200">Goal Type</Label>
              <div className="flex gap-2">
                <Button 
                  variant={goalType === 'daily' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => updateSettings({ goalType: 'daily', goalMinutes: Math.min(goalLessons, 10) })}
                  className={goalType === 'daily' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border-slate-700 text-slate-300'}
                >
                  Daily
                </Button>
                <Button 
                  variant={goalType === 'weekly' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => updateSettings({ goalType: 'weekly' })}
                  className={goalType === 'weekly' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border-slate-700 text-slate-300'}
                >
                  Weekly
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base text-slate-200">Target Lessons</Label>
              <span className="text-indigo-400 font-medium">
                {goalLessons} {goalLessons === 1 ? 'lesson' : 'lessons'}
              </span>
            </div>
            <Slider
              value={[goalLessons]}
              onValueChange={(val) => updateSettings({ goalMinutes: val[0] })}
              max={maxGoal}
              min={1}
              step={1}
              className="py-4"
            />
          </div>

        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-slate-100">Preferences</CardTitle>
          <CardDescription className="text-slate-400">Customize your app experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-slate-200">Dark Mode</Label>
              <p className="text-sm text-slate-500">Toggle the dark theme</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
