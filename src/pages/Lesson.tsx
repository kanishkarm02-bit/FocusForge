import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, PlayCircle, CheckCircle2, Sparkles, ArrowLeft, Trophy } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer_index: number;
}

interface LessonContent {
  title: string;
  teks_reference: string;
  article: string;
  video_search_query: string;
  quiz: QuizQuestion[];
}

export function Lesson() {
  const { learningProfile, addSession, addQuizResult, unlockAchievement } = useAppStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const topic = searchParams.get('topic') || 'General Study';
  
  const [content, setContent] = useState<LessonContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'read' | 'watch' | 'quiz'>('read');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchAiContent = async () => {
      setIsGenerating(true);
      setError(null);
      try {
        const gradeStr = learningProfile?.grade ? ` for a ${learningProfile.grade} student` : '';
        const prompt = `You are an expert Texas educator. Create a comprehensive lesson about "${topic}"${gradeStr}.
        
        You MUST return ONLY a valid JSON object with the following structure. Do not include markdown formatting like \`\`\`json.
        {
          "title": "A catchy title for the lesson",
          "teks_reference": "The specific TEKS standard being covered",
          "article": "A detailed, engaging article (in markdown format) explaining the concept. Use headings, bullet points, and bold text.",
          "video_search_query": "A youtube search query to find a relevant educational video",
          "quiz": [
            {
              "question": "Question 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correct_answer_index": 0
            },
            {
              "question": "Question 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correct_answer_index": 2
            },
            {
              "question": "Question 3",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correct_answer_index": 1
            }
          ]
        }`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        const text = response.text || '';
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedContent = JSON.parse(jsonStr) as LessonContent;
        
        setContent(parsedContent);
        unlockAchievement('texas_pride');
      } catch (error) {
        console.error("Failed to generate AI content", error);
        setError('Failed to load study material. Please try again later.');
      } finally {
        setIsGenerating(false);
      }
    };

    fetchAiContent();
  }, [topic, learningProfile, unlockAchievement]);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const submitQuiz = () => {
    if (!content) return;
    
    let correctCount = 0;
    content.quiz.forEach((q, index) => {
      if (quizAnswers[index] === q.correct_answer_index) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setQuizSubmitted(true);
    
    addQuizResult({
      topic: content.title,
      score: correctCount,
      total: content.quiz.length
    });
    
    // Add a session to track time spent (mocking 15 mins for completing a lesson)
    addSession({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      durationMinutes: 15,
      topic: content.title,
    });

    unlockAchievement('first_lesson');
    if (correctCount === content.quiz.length) {
      unlockAchievement('perfect_quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <Button 
        variant="ghost" 
        className="text-slate-400 hover:text-slate-200 -ml-4"
        onClick={() => navigate('/app/learn')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Curriculum
      </Button>

      {isGenerating ? (
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardContent className="p-12 flex flex-col items-center justify-center space-y-6">
            <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-slate-100">Generating Lesson...</h2>
              <p className="text-slate-400">Our AI is crafting a personalized TEKS-aligned lesson for you.</p>
            </div>
            <div className="w-full max-w-md h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-1/2 animate-[slide_2s_ease-in-out_infinite]"></div>
            </div>
          </CardContent>
        </Card>
      ) : error || !content ? (
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl border-red-500/50">
          <CardContent className="p-12 text-center space-y-4">
            <p className="text-red-400">{error || 'Something went wrong.'}</p>
            <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wider uppercase">
              <BookOpen className="w-3 h-3" />
              {content.teks_reference}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100">{content.title}</h1>
          </div>

          <div className="flex gap-2 p-1 bg-slate-900/50 rounded-lg border border-slate-800 w-fit">
            <button
              onClick={() => setActiveTab('read')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'read' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Read
            </button>
            <button
              onClick={() => setActiveTab('watch')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'watch' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Watch
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Quiz
            </button>
          </div>

          <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl min-h-[400px]">
            <CardContent className="p-6 md:p-8">
              {activeTab === 'read' && (
                <div className="prose prose-invert prose-indigo max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-li:text-slate-300">
                  <Markdown>{content.article}</Markdown>
                </div>
              )}

              {activeTab === 'watch' && (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-6 text-center">
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-100">Video Lesson</h3>
                    <p className="text-slate-400 max-w-md">
                      Search YouTube for: <br/>
                      <span className="font-mono text-indigo-400 bg-slate-950 px-2 py-1 rounded mt-2 inline-block">
                        {content.video_search_query}
                      </span>
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-slate-700 text-slate-300"
                    onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(content.video_search_query)}`, '_blank')}
                  >
                    Open YouTube Search
                  </Button>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-8">
                  {!quizSubmitted ? (
                    <>
                      <div className="space-y-8">
                        {content.quiz.map((q, qIndex) => (
                          <div key={qIndex} className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-200">
                              <span className="text-indigo-400 mr-2">{qIndex + 1}.</span>
                              {q.question}
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                              {q.options.map((opt, oIndex) => (
                                <button
                                  key={oIndex}
                                  onClick={() => handleOptionSelect(qIndex, oIndex)}
                                  className={`p-4 rounded-xl border text-left transition-all ${
                                    quizAnswers[qIndex] === oIndex
                                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-100'
                                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length < content.quiz.length}
                      >
                        Submit Answers
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-6 py-8">
                      <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-4 border-indigo-500">
                        <span className="text-3xl font-bold text-white">{score}/{content.quiz.length}</span>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-slate-100">
                          {score === content.quiz.length ? 'Perfect Score!' : 'Good Job!'}
                        </h3>
                        <p className="text-slate-400">You've completed this lesson.</p>
                      </div>
                      
                      {score === content.quiz.length && (
                        <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-4 py-2 rounded-full">
                          <Trophy className="w-5 h-5" />
                          <span className="font-medium">Achievement Unlocked: Flawless Victory</span>
                        </div>
                      )}

                      <Button 
                        variant="outline"
                        className="mt-4 border-slate-700 text-slate-300"
                        onClick={() => navigate('/app/learn')}
                      >
                        Return to Curriculum
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
