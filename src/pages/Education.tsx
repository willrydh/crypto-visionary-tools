import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  BookMarked, 
  ArrowRight, 
  BrainCircuit,
  LineChart,
  ArrowLeftRight,
  PieChart,
  TrendingUp,
  Clock,
  Check,
  PartyPopper
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

const educationContent = {
  gettingStarted: [
    {
      id: 'intro',
      title: 'Introduction to ProfitPilot',
      description: 'Learn how to navigate the app and use key features',
      duration: '5 min',
      level: 'Beginner',
      completed: true,
      score: 100,
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: 'signals',
      title: 'Understanding Trading Signals',
      description: 'How to interpret and act on trading signals',
      duration: '10 min',
      level: 'Beginner',
      completed: false,
      score: 0,
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 'markets',
      title: 'Global Market Sessions',
      description: 'The difference between market sessions and their impact',
      duration: '8 min',
      level: 'Beginner',
      completed: false,
      score: 0,
      icon: <Clock className="h-5 w-5" />
    }
  ],
  tradingStrategies: [
    {
      id: 'scalping',
      title: 'Scalp Trading Essentials',
      description: 'Short-term trading techniques for quick profits',
      duration: '15 min',
      level: 'Intermediate',
      completed: false,
      score: 0,
      icon: <ArrowLeftRight className="h-5 w-5" />
    },
    {
      id: 'day-trading',
      title: 'Day Trading Fundamentals',
      description: 'How to effectively trade within market hours',
      duration: '12 min',
      level: 'Intermediate',
      completed: false,
      score: 0,
      icon: <LineChart className="h-5 w-5" />
    },
    {
      id: 'night-trading',
      title: 'Night Trading Strategies',
      description: 'Take advantage of overnight market movements',
      duration: '10 min',
      level: 'Advanced',
      completed: false,
      score: 0,
      icon: <BrainCircuit className="h-5 w-5" />
    }
  ],
  advanced: [
    {
      id: 'indicators',
      title: 'Technical Indicators Masterclass',
      description: 'Deep dive into RSI, MACD, and other key indicators',
      duration: '20 min',
      level: 'Advanced',
      completed: false,
      score: 0,
      icon: <PieChart className="h-5 w-5" />
    },
    {
      id: 'psychology',
      title: 'Trading Psychology',
      description: 'Mental frameworks for successful trading',
      duration: '15 min',
      level: 'All Levels',
      completed: false,
      score: 0,
      icon: <BrainCircuit className="h-5 w-5" />
    }
  ]
};

const LearningModuleContent = ({ module }: { module: any }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const { toast } = useToast();
  const steps = [
    { title: "Introduction", content: "This module covers the essential concepts of " + module.title + ". We'll explore key principles and practical applications." },
    { title: "Key Concepts", content: "The fundamental principles of " + module.title + " include understanding market dynamics, pattern recognition, and risk management." },
    { title: "Practical Application", content: "Now let's see how to apply these concepts in real trading scenarios." },
    { title: "Completion", content: "You've reached the end of this module. Please confirm that you've read and understood the material to complete the course." },
    { title: "Summary", content: "Congratulations! You've completed the " + module.title + " module. You now understand the core concepts and how to apply them." }
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      if (currentStep === steps.length - 2) {
        triggerConfetti();
        toast({
          title: "Course Completed!",
          description: `You've completed the ${module.title} module. Great job!`,
        });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const triggerConfetti = () => {
    const end = Date.now() + 2000;
    
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'],
      });
    }, 250);
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{module.title}</h3>
        <Badge variant={module.completed ? "default" : "outline"}>
          {module.completed ? "Completed" : "In Progress"}
        </Badge>
      </div>
      
      <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>Step {currentStep + 1} of {steps.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{steps[currentStep].content}</p>
          
          {currentStep === 3 && (
            <div className="mt-6 p-3 rounded-md border bg-card/50">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="confirm-reading" 
                  checked={confirmed} 
                  onCheckedChange={(checked) => setConfirmed(!!checked)} 
                />
                <label
                  htmlFor="confirm-reading"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm that I have read and understood the material in this module
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Click "Complete Course" to mark this module as finished and move to the next step.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNextStep}
            disabled={(currentStep === 3 && !confirmed) || currentStep === steps.length - 1}
          >
            {currentStep === 3 ? "Complete Course" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const EducationCard = ({ item, onSelect }: { item: any, onSelect: (item: any) => void }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {item.icon}
            <Badge variant={item.completed ? "default" : "outline"} className="h-6">
              {item.level}
            </Badge>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {item.duration}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-0">
        <Button 
          size="sm" 
          className="w-full gap-1" 
          variant={item.completed ? "secondary" : "default"}
          onClick={() => onSelect(item)}
        >
          {item.completed ? 'Review Again' : 'Start Learning'} 
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const Education = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const navigate = useNavigate();

  const allLessons = [
    ...educationContent.gettingStarted, 
    ...educationContent.tradingStrategies, 
    ...educationContent.advanced
  ];
  const completedCount = allLessons.filter(lesson => lesson.completed).length;
  const progressPercentage = Math.round((completedCount / allLessons.length) * 100);

  const handleSelectModule = (module: any) => {
    setSelectedModule(module);
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedModule(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-10"
        >
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Trading Education Center</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enhance your trading skills with our curated educational resources. From beginners to advanced traders, we have learning paths for everyone.
          </p>
        </motion.div>
        
        {selectedModule ? (
          <div>
            <Button 
              variant="outline" 
              onClick={handleBackToList} 
              className="mb-6"
            >
              Back to Modules
            </Button>
            <LearningModuleContent module={selectedModule} />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Your Learning Progress</h2>
                  <p className="text-sm text-muted-foreground">Track your educational journey</p>
                </div>
                
                <div className="flex items-center gap-2 bg-card p-2 rounded-md border sm:min-w-[200px]">
                  <div className="w-full max-w-[150px]">
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{progressPercentage}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-medium">Beginner</h3>
                    <p className="text-sm text-muted-foreground">3 Courses</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                      <LineChart className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-medium">Intermediate</h3>
                    <p className="text-sm text-muted-foreground">3 Courses</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                      <BrainCircuit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-medium">Advanced</h3>
                    <p className="text-sm text-muted-foreground">2 Courses</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                      <BookMarked className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-medium">Completed</h3>
                    <p className="text-sm text-muted-foreground">{completedCount} Lessons</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full sm:w-auto mb-6">
                  <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                  <TabsTrigger value="trading-strategies">Trading Strategies</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="getting-started" className="mt-4">
                  <h2 className="text-xl font-semibold mb-4">Getting Started with ProfitPilot</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {educationContent.gettingStarted.map(item => (
                      <EducationCard key={item.id} item={item} onSelect={handleSelectModule} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="trading-strategies" className="mt-4">
                  <h2 className="text-xl font-semibold mb-4">Trading Strategies</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {educationContent.tradingStrategies.map(item => (
                      <EducationCard key={item.id} item={item} onSelect={handleSelectModule} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="mt-4">
                  <h2 className="text-xl font-semibold mb-4">Advanced Topics</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {educationContent.advanced.map(item => (
                      <EducationCard key={item.id} item={item} onSelect={handleSelectModule} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Education;
