import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

type Question = {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    value: 'positive' | 'neutral' | 'negative';
  }[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "Comment vous sentez-vous au réveil ce matin ?",
    options: [
      { id: "q1o1", text: "Énergique et enthousiaste", value: "positive" },
      { id: "q1o2", text: "Normal, ni bien ni mal", value: "neutral" },
      { id: "q1o3", text: "Fatigué et sans motivation", value: "negative" }
    ]
  },
  {
    id: 2,
    text: "Comment décririez-vous votre niveau d'énergie actuellement ?",
    options: [
      { id: "q2o1", text: "Plein d'énergie", value: "positive" },
      { id: "q2o2", text: "Stable", value: "neutral" },
      { id: "q2o3", text: "Faible, j'ai du mal à me concentrer", value: "negative" }
    ]
  },
  {
    id: 3,
    text: "Comment vous sentez-vous face aux défis d'aujourd'hui ?",
    options: [
      { id: "q3o1", text: "Confiant et prêt à les affronter", value: "positive" },
      { id: "q3o2", text: "Je pense pouvoir les gérer", value: "neutral" },
      { id: "q3o3", text: "Inquiet et dépassé", value: "negative" }
    ]
  },
  {
    id: 4,
    text: "Comment qualifieriez-vous votre sommeil la nuit dernière ?",
    options: [
      { id: "q4o1", text: "Réparateur et suffisant", value: "positive" },
      { id: "q4o2", text: "Correct mais pas optimal", value: "neutral" },
      { id: "q4o3", text: "Perturbé ou insuffisant", value: "negative" }
    ]
  },
  {
    id: 5,
    text: "Comment vous sentez-vous dans vos relations avec les autres aujourd'hui ?",
    options: [
      { id: "q5o1", text: "Connecté et sociable", value: "positive" },
      { id: "q5o2", text: "Normal, ni très sociable ni isolé", value: "neutral" },
      { id: "q5o3", text: "Distant ou irritable", value: "negative" }
    ]
  },
  {
    id: 6,
    text: "Quel est votre niveau d'anxiété aujourd'hui ?",
    options: [
      { id: "q6o1", text: "Calme et détendu", value: "positive" },
      { id: "q6o2", text: "Légèrement préoccupé", value: "neutral" },
      { id: "q6o3", text: "Anxieux et inquiet", value: "negative" }
    ]
  },
  {
    id: 7,
    text: "Comment vous sentez-vous par rapport à vos activités prévues aujourd'hui ?",
    options: [
      { id: "q7o1", text: "Enthousiaste et impatient", value: "positive" },
      { id: "q7o2", text: "Neutre", value: "neutral" },
      { id: "q7o3", text: "Je préférerais les éviter", value: "negative" }
    ]
  }
];

export default function MoodQuestionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [_, navigate] = useLocation();

  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1 && answers[currentQuestion]) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Calculate mood based on answers
  const calculateMood = () => {
    const counts = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    answers.forEach((answerId, index) => {
      const question = questions[index];
      const selectedOption = question.options.find(opt => opt.id === answerId);
      if (selectedOption) {
        counts[selectedOption.value]++;
      }
    });

    // Calculer le score total
    const total = counts.positive + counts.neutral + counts.negative;
    
    // Calculer le pourcentage des réponses positives, neutres et négatives
    const positivePercent = (counts.positive / total) * 100;
    const neutralPercent = (counts.neutral / total) * 100;
    const negativePercent = (counts.negative / total) * 100;
    
    // Déterminer l'humeur dominante avec une évaluation plus détaillée
    if (positivePercent >= 60) {
      return 'happy'; // Très positif
    } else if (positivePercent >= 40 && neutralPercent >= 30) {
      return 'neutral'; // Plutôt positif mais avec beaucoup de nuances
    } else if (negativePercent >= 60) {
      return 'sad'; // Très négatif
    } else if (negativePercent >= 40 && neutralPercent >= 30) {
      return 'neutral'; // Plutôt négatif mais avec des nuances
    } else if (neutralPercent >= 50) {
      return 'neutral'; // Majoritairement neutre
    } else if (positivePercent > negativePercent) {
      return 'neutral'; // Légèrement positif mais pas de manière significative
    } else if (negativePercent > positivePercent) {
      return 'sad'; // Légèrement négatif
    } else {
      return 'neutral'; // Équilibré ou autres scénarios
    }
  };

  // Submit mood entry to the API
  const submitMoodMutation = useMutation({
    mutationFn: async () => {
      const moodType = calculateMood();
      // Compter les réponses par catégorie
      const positiveCount = answers.filter((answerId, index) => {
        const question = questions[index];
        const option = question.options.find(opt => opt.id === answerId);
        return option?.value === 'positive';
      }).length;
      
      const neutralCount = answers.filter((answerId, index) => {
        const question = questions[index];
        const option = question.options.find(opt => opt.id === answerId);
        return option?.value === 'neutral';
      }).length;
      
      const negativeCount = answers.filter((answerId, index) => {
        const question = questions[index];
        const option = question.options.find(opt => opt.id === answerId);
        return option?.value === 'negative';
      }).length;
      
      // Calculer les pourcentages
      const total = positiveCount + neutralCount + negativeCount;
      const positivePercent = Math.round((positiveCount / total) * 100);
      const neutralPercent = Math.round((neutralCount / total) * 100);
      const negativePercent = Math.round((negativeCount / total) * 100);
      
      // Générer une analyse de l'humeur
      let moodAnalysis = "";
      if (positivePercent >= 60) {
        moodAnalysis = "Humeur très positive. Continuer les activités qui vous font du bien.";
      } else if (positivePercent >= 40 && neutralPercent >= 30) {
        moodAnalysis = "Humeur plutôt positive avec quelques réserves. Maintenir l'équilibre actuel.";
      } else if (negativePercent >= 60) {
        moodAnalysis = "Humeur plutôt négative. Envisager des activités relaxantes et apaisantes.";
      } else if (negativePercent >= 40) {
        moodAnalysis = "Humeur légèrement négative. Privilégier les moments de détente.";
      } else if (neutralPercent >= 50) {
        moodAnalysis = "Humeur principalement neutre. Chercher des sources de motivation et de joie.";
      } else {
        moodAnalysis = "Humeur mixte. Prendre le temps d'identifier les facteurs qui influencent votre état émotionnel.";
      }
      
      const notes = `Questionnaire d'humeur du ${new Date().toLocaleDateString('fr-FR')}. 
Résultats: ${positivePercent}% positifs, ${neutralPercent}% neutres, ${negativePercent}% négatifs.
Analyse: ${moodAnalysis}`;

      const moodData = {
        moodType,
        notes,
        date: new Date().toISOString()
      };
      
      const res = await apiRequest('POST', '/api/mood-entries', moodData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood-entries'] });
      toast({
        title: 'Humeur enregistrée',
        description: 'Votre humeur a été évaluée avec succès!'
      });
      navigate(`/recommendations/${data.moodType}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Handle completing the questionnaire
  const handleComplete = () => {
    if (answers.every(answer => answer)) {
      setIsCompleted(true);
      submitMoodMutation.mutate();
    } else {
      toast({
        title: 'Questionnaire incomplet',
        description: 'Veuillez répondre à toutes les questions.',
        variant: 'destructive'
      });
    }
  };

  // Handle selecting an answer
  const handleSelectAnswer = (answerId: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerId;
    setAnswers(newAnswers);
  };

  // Calculate progress percentage
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">Évaluation de votre humeur</CardTitle>
        <div className="mt-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-center mt-1 text-gray-500">Question {currentQuestion + 1} sur {questions.length}</p>
        </div>
      </CardHeader>
      <CardContent>
        {!isCompleted ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{questions[currentQuestion].text}</h3>
            <RadioGroup 
              value={answers[currentQuestion]} 
              onValueChange={handleSelectAnswer}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option) => (
                <div 
                  key={option.id} 
                  className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    answers[currentQuestion] === option.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200'
                  } cursor-pointer transition-colors`}
                  onClick={() => handleSelectAnswer(option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="text-primary" />
                  <Label htmlFor={option.id} className="flex-grow cursor-pointer">{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Questionnaire complété!</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Nous analysons vos réponses pour déterminer votre humeur et vous proposer des recommandations personnalisées.
              </p>
              
              <div className="bg-white shadow-md rounded-lg p-4 max-w-xl mx-auto">
                <h3 className="font-medium text-xl mb-4 text-primary border-b pb-2">Analyse de votre humeur</h3>
                
                {/* Graphique de l'humeur */}
                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-3">Répartition des réponses</h4>
                  <div className="h-48 flex items-end justify-center space-x-8 border-b border-l relative">
                    {/* Axe Y (%) */}
                    <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500">
                      <span>100%</span>
                      <span>75%</span>
                      <span>50%</span>
                      <span>25%</span>
                      <span>0%</span>
                    </div>
                    
                    {/* Barres du graphique */}
                    <div className="flex flex-col items-center">
                      {/* Valeur calculée pour les réponses positives */}
                      {(() => {
                        const count = answers.filter((answerId, index) => {
                          const question = questions[index];
                          const option = question.options.find(opt => opt.id === answerId);
                          return option?.value === 'positive';
                        }).length;
                        const percentage = (count / 7) * 100;
                        return (
                          <>
                            <div 
                              className="w-16 bg-green-400 rounded-t-md"
                              style={{ height: `${percentage}%` }}
                            ></div>
                            <div className="mt-2 text-sm font-medium text-green-600">
                              {count} / 7
                            </div>
                            <div className="text-sm text-gray-500">Positives</div>
                          </>
                        );
                      })()}
                    </div>
                    
                    <div className="flex flex-col items-center">
                      {/* Valeur calculée pour les réponses neutres */}
                      {(() => {
                        const count = answers.filter((answerId, index) => {
                          const question = questions[index];
                          const option = question.options.find(opt => opt.id === answerId);
                          return option?.value === 'neutral';
                        }).length;
                        const percentage = (count / 7) * 100;
                        return (
                          <>
                            <div 
                              className="w-16 bg-blue-400 rounded-t-md"
                              style={{ height: `${percentage}%` }}
                            ></div>
                            <div className="mt-2 text-sm font-medium text-blue-600">
                              {count} / 7
                            </div>
                            <div className="text-sm text-gray-500">Neutres</div>
                          </>
                        );
                      })()}
                    </div>
                    
                    <div className="flex flex-col items-center">
                      {/* Valeur calculée pour les réponses négatives */}
                      {(() => {
                        const count = answers.filter((answerId, index) => {
                          const question = questions[index];
                          const option = question.options.find(opt => opt.id === answerId);
                          return option?.value === 'negative';
                        }).length;
                        const percentage = (count / 7) * 100;
                        return (
                          <>
                            <div 
                              className="w-16 bg-red-400 rounded-t-md"
                              style={{ height: `${percentage}%` }}
                            ></div>
                            <div className="mt-2 text-sm font-medium text-red-600">
                              {count} / 7
                            </div>
                            <div className="text-sm text-gray-500">Négatives</div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                
                {/* Mini Agenda journalier */}
                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-3">Historique d'humeur</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - 6 + i);
                      const day = date.getDate();
                      const month = date.toLocaleDateString('fr-FR', { month: 'short' });
                      const isToday = i === 6;
                      
                      return (
                        <div 
                          key={i} 
                          className={`text-center p-2 rounded ${isToday ? 'bg-primary text-white ring-2 ring-primary ring-offset-2' : 'bg-gray-100'}`}
                        >
                          <span className="block text-xs">{month}</span>
                          <span className="block font-medium">{day}</span>
                          <span className={`block text-lg ${isToday ? '' : 'text-gray-400'}`}>
                            {isToday ? '😊' : '–'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Recommandations personnalisées */}
                <div>
                  <h4 className="font-medium text-lg mb-2">Recommandations pour vous</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {(() => {
                      const isFemale = user?.gender === 'female';
                      
                      const positiveCount = answers.filter((answerId, index) => {
                        const question = questions[index];
                        const option = question.options.find(opt => opt.id === answerId);
                        return option?.value === 'positive';
                      }).length;
                      
                      const negativeCount = answers.filter((answerId, index) => {
                        const question = questions[index];
                        const option = question.options.find(opt => opt.id === answerId);
                        return option?.value === 'negative';
                      }).length;
                      
                      // Déterminer la phase du cycle (simulation)
                      // En réalité, ce calcul serait basé sur la date des dernières règles
                      const cyclePhase = isFemale ? Math.floor(Math.random() * 4) : -1;
                      const cyclePhaseNames = ['menstruelle', 'folliculaire', 'ovulatoire', 'lutéale'];
                      
                      // Recommandations générales basées sur l'humeur
                      if (positiveCount >= 5) {
                        return (
                          <>
                            <p className="mb-2">Votre humeur est très positive ! Voici quelques suggestions pour maintenir ce bien-être :</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Écoutez des musiques énergisantes et joyeuses</li>
                              <li>Partagez votre bonne humeur avec vos proches</li>
                              <li>Profitez de cette énergie pour entreprendre un nouveau projet</li>
                              
                              {/* Recommandations spécifiques aux femmes basées sur le cycle */}
                              {isFemale && (
                                <>
                                  <li className="mt-2 font-medium text-primary">Basé sur votre phase {cyclePhaseNames[cyclePhase]} :</li>
                                  {cyclePhase === 0 && <li>Privilégiez les activités douces et relaxantes</li>}
                                  {cyclePhase === 1 && <li>C'est le moment idéal pour des projets créatifs</li>}
                                  {cyclePhase === 2 && <li>Profitez de votre énergie pour des activités sociales</li>}
                                  {cyclePhase === 3 && <li>Gardez une routine équilibrée pour maintenir cette humeur positive</li>}
                                </>
                              )}
                            </ul>
                          </>
                        );
                      } else if (negativeCount >= 5) {
                        return (
                          <>
                            <p className="mb-2">Votre humeur semble un peu basse. Voici quelques suggestions pour vous aider à vous sentir mieux :</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Prenez un moment pour vous détendre et respirer profondément</li>
                              <li>Écoutez de la musique douce et apaisante</li>
                              <li>Faites une activité qui vous fait habituellement plaisir</li>
                              
                              {/* Recommandations spécifiques aux femmes basées sur le cycle */}
                              {isFemale && (
                                <>
                                  <li className="mt-2 font-medium text-primary">Basé sur votre phase {cyclePhaseNames[cyclePhase]} :</li>
                                  {cyclePhase === 0 && <li>Un bain chaud et des tisanes apaisantes peuvent soulager l'inconfort</li>}
                                  {cyclePhase === 1 && <li>Essayez une courte méditation pour réduire le stress</li>}
                                  {cyclePhase === 2 && <li>Une activité physique modérée peut améliorer l'humeur</li>}
                                  {cyclePhase === 3 && <li>Évitez les stimulants comme la caféine qui peuvent amplifier l'anxiété</li>}
                                </>
                              )}
                            </ul>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <p className="mb-2">Votre humeur est équilibrée. Voici quelques suggestions pour optimiser votre journée :</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Prenez du temps pour une activité créative</li>
                              <li>Faites une courte promenade pour vous aérer l'esprit</li>
                              <li>Écoutez une playlist variée qui correspond à vos goûts</li>
                              
                              {/* Recommandations spécifiques aux femmes basées sur le cycle */}
                              {isFemale && (
                                <>
                                  <li className="mt-2 font-medium text-primary">Basé sur votre phase {cyclePhaseNames[cyclePhase]} :</li>
                                  {cyclePhase === 0 && <li>Des aliments riches en fer peuvent vous aider à maintenir votre énergie</li>}
                                  {cyclePhase === 1 && <li>C'est un bon moment pour planifier de nouveaux projets</li>}
                                  {cyclePhase === 2 && <li>Profitez de votre communication améliorée pour des interactions sociales</li>}
                                  {cyclePhase === 3 && <li>Augmentez légèrement vos apports caloriques si vous ressentez plus de faim</li>}
                                </>
                              )}
                            </ul>
                          </>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
            
            {submitMoodMutation.isPending && (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {!isCompleted && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToPreviousQuestion}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
          </Button>
          {currentQuestion < questions.length - 1 ? (
            <Button 
              onClick={goToNextQuestion}
              disabled={!answers[currentQuestion]}
            >
              Suivant <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={!answers[currentQuestion] || submitMoodMutation.isPending}
            >
              {submitMoodMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⚪</span> Traitement...
                </>
              ) : (
                <>Terminer</>
              )}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}