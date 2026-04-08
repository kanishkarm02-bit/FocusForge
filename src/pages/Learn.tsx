import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Calculator, FlaskConical, ChevronRight, PlayCircle, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GRADES = [
  '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade',
  '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'
];

const SUBJECTS = [
  { id: 'math', name: 'Math', icon: Calculator, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'science', name: 'Science', icon: FlaskConical, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'language_arts', name: 'Language Arts', icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'social_studies', name: 'Social Studies', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export function Learn() {
  const { learningProfile, updateLearningProfile } = useAppStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(learningProfile ? 3 : 1);
  const [selectedGrade, setSelectedGrade] = useState(learningProfile?.grade || '');
  const [selectedSubject, setSelectedSubject] = useState(learningProfile?.subject || '');

  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
    setStep(2);
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    updateLearningProfile({ grade: selectedGrade, subject: subjectId });
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedGrade('');
    setSelectedSubject('');
    updateLearningProfile({ grade: '', subject: '' });
  };

  const getModules = () => {
    const subjectName = SUBJECTS.find(s => s.id === selectedSubject)?.name || 'Subject';
    
    // Mock TEKS-aligned curriculum
    if (selectedSubject === 'science' && selectedGrade === '8th Grade') {
      return [
        { id: 1, title: `TEKS 8.5A: Atomic Structure`, description: `Describe the structure of atoms, including the masses, electrical charges, and locations, of protons and neutrons in the nucleus and electrons in the electron cloud.` },
        { id: 2, title: `TEKS 8.5B: Reactivity`, description: `Identify that protons determine an element's identity and valence electrons determine its chemical properties, including reactivity.` },
        { id: 3, title: `TEKS 8.5C: Periodic Table`, description: `Interpret the arrangement of the Periodic Table, including groups and periods, to explain how properties are used to classify elements.` },
      ];
    }
    
    if (selectedSubject === 'math' && selectedGrade === '8th Grade') {
      return [
        { id: 1, title: `TEKS 8.2A: Real Numbers`, description: `Extend previous knowledge of sets and subsets using a visual representation to describe relationships between sets of real numbers.` },
        { id: 2, title: `TEKS 8.2B: Approximating Irrational Numbers`, description: `Approximate the value of an irrational number, including π and square roots of numbers less than 225, and locate that rational number approximation on a number line.` },
        { id: 3, title: `TEKS 8.2C: Scientific Notation`, description: `Convert between standard decimal notation and scientific notation.` },
      ];
    }

    // Generic fallback
    return [
      { id: 1, title: `TEKS Unit 1: Introduction to ${subjectName}`, description: `Foundational TEKS concepts for ${selectedGrade} ${subjectName}.` },
      { id: 2, title: `TEKS Unit 2: Core Principles of ${subjectName}`, description: `Deep dive into the main TEKS standards.` },
      { id: 3, title: `TEKS Unit 3: Advanced ${subjectName} Applications`, description: `Mastering the TEKS skills with practice and assessment.` },
    ];
  };

  const startModule = (moduleTitle: string) => {
    navigate(`/app/lesson?topic=${encodeURIComponent(moduleTitle)}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Texas TEKS Curriculum</h1>
          <p className="text-slate-400">Your personalized learning path aligned with Texas standards.</p>
        </div>
        {step === 3 && (
          <Button variant="outline" size="sm" onClick={handleReset} className="border-slate-700 text-slate-400 hover:text-slate-200">
            Change Grade/Subject
          </Button>
        )}
      </div>

      {step === 1 && (
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-100">What grade are you in?</CardTitle>
            <CardDescription className="text-slate-400">Select your current grade level to customize your learning path.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {GRADES.map((grade) => (
                <Button
                  key={grade}
                  variant="outline"
                  className="h-16 border-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all"
                  onClick={() => handleGradeSelect(grade)}
                >
                  {grade}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl animate-in slide-in-from-right-8 duration-300">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-indigo-400 mb-2">
              <button onClick={() => setStep(1)} className="hover:underline">{selectedGrade}</button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-500">Select Subject</span>
            </div>
            <CardTitle className="text-slate-100">Choose a Core Subject</CardTitle>
            <CardDescription className="text-slate-400">What would you like to focus on?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject.id)}
                  className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800 transition-all group"
                >
                  <div className={`p-4 rounded-full ${subject.bg} ${subject.color} group-hover:scale-110 transition-transform`}>
                    <subject.icon className="w-8 h-8" />
                  </div>
                  <span className="font-medium text-slate-200 text-lg text-center">{subject.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-500/20 p-3 rounded-xl">
              {(() => {
                const Icon = SUBJECTS.find(s => s.id === selectedSubject)?.icon || BookOpen;
                return <Icon className="w-6 h-6 text-indigo-400" />;
              })()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{selectedGrade} {SUBJECTS.find(s => s.id === selectedSubject)?.name}</h2>
              <p className="text-slate-400">Complete the TEKS modules below to master this subject.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getModules().map((mod, index) => (
              <Card key={mod.id} className="bg-slate-900/80 border-slate-800 backdrop-blur-xl flex flex-col">
                <CardHeader>
                  <div className="text-xs font-bold tracking-wider text-indigo-400 uppercase mb-2">Module {index + 1}</div>
                  <CardTitle className="text-lg text-slate-100">{mod.title}</CardTitle>
                  <CardDescription className="text-slate-400 mt-2 line-clamp-3">{mod.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-6">
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    onClick={() => startModule(mod.title)}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Start Lesson
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
