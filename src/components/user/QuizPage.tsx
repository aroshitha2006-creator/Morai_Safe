import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { QuizQuestion } from '../../types';
import { Language, translations } from '../../services/i18n';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Flood Safety',
    question: 'How much moving floodwater is typically enough to sweep an adult off their feet?',
    questionTamil: 'ஒரு வயது வந்த மனிதரை அடித்துச் செல்ல எவ்வளவு ஆழமான பாயும் வெள்ள நீர் போதுமானது?',
    options: [
      'Just 15 centimeters (6 inches)',
      'At least 60 centimeters (2 feet)',
      'At least 1 meter',
      'Only water above chest level'
    ],
    optionsTamil: [
      'வெறும் 15 சென்டிமீட்டர் (6 அங்குலம்)',
      'குறைந்தபட்சம் 60 சென்டிமீட்டர் (2 அடி)',
      'குறைந்தபட்சம் 1 மீட்டர்',
      'மார்பளவு நீர் மட்டுமே'
    ],
    correctAnswer: 0,
    explanation: 'According to NDMA and FEMA, just 15 cm (6 inches) of rapidly moving water can knock down an adult, and 30 cm (1 foot) can float a vehicle.',
    explanationTamil: 'பேரிடர் மேலாண்மை வழிகாட்டலின்படி, வெறும் 15 செ.மீ பாயும் வெள்ள நீரே மனிதரை நிலைகுலையச் செய்ய போதுமானது.'
  },
  {
    id: 2,
    category: 'Cyclone Precautions',
    question: 'During a tropical cyclone, what does the sudden cessation of wind and calm weather indicate?',
    questionTamil: 'புயலின் போது காற்று திடீரென நின்று அமைதியான சூழல் ஏற்படுவது எதைக் குறிக்கிறது?',
    options: [
      'The cyclone has completely dissipated and it is safe to venture outside',
      'The "Eye" of the cyclone is passing over; extreme reverse gale winds will resume shortly',
      'The cyclone has permanently shifted into the interior mountains',
      'Low atmospheric pressure has neutralized all wind currents'
    ],
    optionsTamil: [
      'புயல் முற்றிலும் ஓய்ந்துவிட்டது, வெளியே செல்லலாம்',
      'புயலின் "கண்" (மையப்பகுதி) கடக்கிறது; சிறிது நேரத்தில் எதிர் திசையிலிருந்து மீண்டும் பலத்த காற்று வீசும்',
      'புயல் மலைப்பகுதிக்கு நகர்ந்துவிட்டது',
      'காற்றழுத்தம் சீராகிவிட்டது'
    ],
    correctAnswer: 1,
    explanation: 'The Eye is the calm center of a tropical cyclone. The opposite side of the storm wall will strike shortly with equal or greater ferocity in the reverse direction.',
    explanationTamil: 'இது புயலின் மையப் பகுதியாகும். மிக விரைவில் எதிர் திசையிலிருந்து அதிக வேகத்துடன் காற்று மீண்டும் தாக்கும்.'
  },
  {
    id: 3,
    category: 'Earthquake Action',
    question: 'What is the universally certified immediate response upon feeling earthquake tremors inside a building?',
    questionTamil: 'நிலநடுக்கத்தின் போது கட்டடத்திற்குள் இருக்கும் போது செய்ய வேண்டிய உடனடி உயிர் பாதுகாப்பு நடவடிக்கை என்ன?',
    options: [
      'Run immediately into the staircase to get outside',
      'Drop to hands and knees, Cover head under sturdy furniture, Hold on until shaking stops',
      'Stand directly beneath large windows to monitor damage',
      'Board the building elevator to reach the ground floor quickly'
    ],
    optionsTamil: [
      'உடனடியாக படிக்கட்டுகளில் இறங்கி வெளியே ஓட வேண்டும்',
      'தரை அமர்-மூடிக்கொள்-பிடித்துக்கொள் (Drop, Cover and Hold on)',
      'வெளியே என்ன நடக்கிறது என பார்க்க ஜன்னல் அருகே நிற்க வேண்டும்',
      'மின் தூக்கியைப் (Elevator) பயன்படுத்தி விரைவாக தரைத்தளம் செல்ல வேண்டும்'
    ],
    correctAnswer: 1,
    explanation: '"Drop, Cover, and Hold On" protects your vitals from falling masonry, shattered glass, and overhead collapse.',
    explanationTamil: '"தரை அமர், மூடிக்கொள், பிடித்துக்கொள்" என்ற பயிற்சியே தலை மற்றும் உடலை இடிபாடுகளிலிருந்து பாதுகாக்கும்.'
  },
  {
    id: 4,
    category: 'First Aid & CPR',
    question: 'What is the correct compression rate for adult Hands-Only CPR in sudden cardiac arrest?',
    questionTamil: 'மாரடைப்பு ஏற்பட்ட ஒருவருக்கு நெஞ்சுப் பகுதியில் செலுத்த வேண்டிய அழுத்தங்களின் சரியான வேகம் என்ன?',
    options: [
      '30-40 compressions per minute',
      '60 compressions per minute',
      '100-120 compressions per minute',
      '200 compressions per minute'
    ],
    optionsTamil: [
      'நிமிடத்திற்கு 30-40 முறை',
      'நிமிடத்திற்கு 60 முறை',
      'நிமிடத்திற்கு 100-120 முறை',
      'நிமிடத்திற்கு 200 முறை'
    ],
    correctAnswer: 2,
    explanation: 'WHO and Red Cross mandate 100-120 chest compressions per minute at a depth of 5-6 cm in the center of the chest.',
    explanationTamil: 'ரெட் கிராஸ் வழிகாட்டலின்படி, நிமிடத்திற்கு 100 முதல் 120 முறை நெஞ்சின் நடுவில் அழுத்த வேண்டும்.'
  },
  {
    id: 5,
    category: 'Fire Safety',
    question: 'When escaping a smoke-filled corridor during a structure fire, what is the safest posture?',
    questionTamil: 'புகை சூழ்ந்த கட்டடத்திலிருந்து வெளியேறும் போது எந்த முறையில் செல்வது பாதுகாப்பானது?',
    options: [
      'Stand upright and sprint through the smoke with eyes closed',
      'Drop to hands and knees and crawl under the smoke layer',
      'Jump from balconies regardless of floor height',
      'Hide inside a bathroom with doors locked'
    ],
    optionsTamil: [
      'கண்களை மூடிக்கொண்டு வேகமாக ஓடுதல்',
      'தரையில் தவழ்ந்து புகையின் கீழ் மட்டத்தில் ஊர்ந்து செல்லுதல்',
      'பால்கனியிலிருந்து கீழே குதித்தல்',
      'குளியலறைக்குள் சென்று கதவை பூட்டிக்கொள்ளுதல்'
    ],
    correctAnswer: 1,
    explanation: 'Smoke and lethal carbon monoxide gases rise. The coolest, cleanest breathable air remains 30 to 60 cm directly above the floor.',
    explanationTamil: 'நச்சுப் புகை மேலே எழும்புவதால், தரைக்கு அருகே உள்ள சுத்தமான காற்றை சுவாசித்து தவழ்ந்து செல்ல வேண்டும்.'
  },
  {
    id: 6,
    category: 'Drinking Water Purification',
    question: 'What is the minimum rolling boil time required to disinfect biologically contaminated drinking water?',
    questionTamil: 'கிருமி நிறைந்த நீரைக் குடிப்பதற்கு முன் குறைந்தபட்சம் எவ்வளவு நேரம் கொதிக்க வைக்க வேண்டும்?',
    options: [
      'Warm the water until bubbles just start forming',
      'Minimum 1 minute of vigorous, rolling boil',
      'Minimum 45 minutes of boiling',
      'Boiling is ineffective against waterborne cholera'
    ],
    optionsTamil: [
      'லேசாக குமிழ்கள் வரும் வரை',
      'குறைந்தபட்சம் 1 முழு நிமிடம் கொதிக்க வைத்தல் (Rolling boil)',
      'குறைந்தபட்சம் 45 நிமிடங்கள்',
      'கொதிக்க வைப்பது பயன்தராது'
    ],
    correctAnswer: 1,
    explanation: 'WHO recommends bringing water to a vigorous, rolling boil for at least 1 minute, which destroys bacteria, parasites, and viruses.',
    explanationTamil: '1 நிமிடம் தீவிரமாக கொதிக்கும் நீர் அனைத்து பாக்டீரியா மற்றும் வைரஸ்களை அழித்துவிடும்.'
  }
];

interface QuizPageProps {
  language: Language;
}

export const QuizPage: React.FC<QuizPageProps> = ({ language }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const t = translations[language];
  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (optIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIndex }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setQuizFinished(false);
  };

  // Calculate score
  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-sky-600" />
            <span>{t.quiz}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive NDMA survival evaluation covering flood, cyclone, earthquake, and trauma first aid
          </p>
        </div>

        {!quizFinished && (
          <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
            Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
          </span>
        )}
      </div>

      {!quizFinished ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-150">
          {/* Category Tag */}
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800">
            {question.category}
          </span>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {language === 'ta' ? question.questionTamil : question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {(language === 'ta' ? question.optionsTamil : question.options).map((opt, idx) => {
              const isSelected = selectedAnswers[currentIdx] === idx;
              const isCorrect = idx === question.correctAnswer;
              
              let btnStyle = 'border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 bg-white text-slate-800';
              if (showExplanation) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-red-500 bg-red-50 text-red-950 line-through';
                } else {
                  btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {showExplanation && (
                    <div>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 animate-in fade-in duration-150">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                EXPLANATION & NDMA RATIONALE:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {language === 'ta' ? question.explanationTamil : question.explanation}
              </p>
            </div>
          )}

          {/* Footer Action */}
          <div className="flex justify-end pt-2 border-t border-slate-100">
            {showExplanation && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Final Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completion Card */
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">Disaster Preparedness Evaluation Complete!</h2>
            <p className="text-xs text-slate-500">
              Your community disaster readiness score has been recorded.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 inline-block text-center px-10">
            <span className="text-4xl font-extrabold text-slate-900 font-sans block">{percentage}%</span>
            <span className="text-xs font-semibold text-slate-600">
              {score} of {QUIZ_QUESTIONS.length} Questions Correct
            </span>
          </div>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            {percentage >= 80 
              ? 'Outstanding performance! You possess essential life-saving knowledge for coastal floods, cyclones, and medical emergency scenarios.'
              : 'Good effort! Review the 12 downloadable PDF guides in the Resources section to enhance your household disaster readiness.'}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
