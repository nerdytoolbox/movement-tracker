import { useState, useEffect } from 'react';
import { ROUTINES } from '../data/routines';
import { EXERCISES } from '../data/exercises';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { playTimerSound } from '../utils/sound';
import type { Routine } from '../types';

export function RoutinesScreen() {
  const { recordMovement, todayLog } = useApp();
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<{ id: string; name: string; description: string; imageEmoji: string; durationSeconds: number } | null>(null);
  const [completedToday, setCompletedToday] = useState<Set<string>>(
    new Set(todayLog?.routinesCompleted || [])
  );
  const [filter, setFilter] = useState<5 | 10 | 'all'>('all');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    if (selectedExercise && timeRemaining === 0) {
      setTimeRemaining(selectedExercise.durationSeconds);
    }
  }, [selectedExercise]);

  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimerActive(false);
          playTimerSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  async function startRoutine(routine: Routine) {
    await recordMovement(undefined, routine.id);
    setCompletedToday(prev => new Set([...prev, routine.id]));
  }

  const displayed = filter === 'all' ? ROUTINES : ROUTINES.filter(r => r.durationMinutes === filter);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 px-4 pt-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Routines 📋</h1>

      <div className="flex gap-2 mb-5">
        {(['all', 5, 10] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-violet-500 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {f === 'all' ? 'All' : `${f} min`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {displayed.map(routine => {
          const isDone = completedToday.has(routine.id);
          return (
            <Card key={routine.id} onClick={() => setSelectedRoutine(routine)}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{routine.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-zinc-100">{routine.name}</h3>
                    {isDone && <span className="text-emerald-400 text-sm">✓</span>}
                  </div>
                  <p className="text-zinc-500 text-sm mb-2">{routine.description}</p>
                  <div className="flex gap-2">
                    <Badge variant="purple">{routine.durationMinutes} min</Badge>
                    <Badge variant="zinc">{routine.exercises.length} exercises</Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedRoutine && (
        <Modal isOpen={true} title={selectedRoutine.name} onClose={() => setSelectedRoutine(null)}>
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">{selectedRoutine.emoji}</div>
            <p className="text-zinc-400 mb-3">{selectedRoutine.description}</p>
            <div className="flex gap-2 justify-center">
              <Badge variant="purple">{selectedRoutine.durationMinutes} min</Badge>
              <Badge variant="zinc">{selectedRoutine.exercises.length} exercises</Badge>
            </div>
          </div>

           <div className="space-y-3 mb-6">
             {selectedRoutine.exercises.map((re, i) => {
               const exercise = EXERCISES.find(e => e.id === re.exerciseId);
               if (!exercise) return null;
               return (
                   <button
                     key={i}
                     onClick={() => {
                       setSelectedExercise({
                         id: exercise.id,
                         name: exercise.name,
                         description: exercise.description,
                         imageEmoji: exercise.imageEmoji!,
                         durationSeconds: exercise.durationSeconds
                       });
                       setTimeRemaining(0);
                       setIsTimerActive(false);
                     }}
                    className="w-full text-left flex gap-3 items-start p-3 bg-zinc-800 rounded-2xl hover:bg-zinc-700 transition-colors"
                  >
                   <span className="text-2xl">{exercise.imageEmoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-zinc-100">{exercise.name}</div>
                      <div className="text-zinc-500 text-sm">{exercise.description}</div>
                      <div className="text-zinc-600 text-xs mt-1">
                        {re.reps ? `${re.reps} reps` : `${re.durationSeconds}s`}
                      </div>
                    </div>
                 </button>
               );
             })}
           </div>

          <Button
            size="xl"
            onClick={() => { startRoutine(selectedRoutine); setSelectedRoutine(null); }}
            disabled={completedToday.has(selectedRoutine.id)}
          >
            {completedToday.has(selectedRoutine.id) ? '✓ Done today!' : '▶ Start routine'}
           </Button>
         </Modal>
       )}

       {selectedExercise && (
         <Modal isOpen={true} title={selectedExercise.name} onClose={() => {
           setSelectedExercise(null);
           setIsTimerActive(false);
         }}>
           <div className="text-center mb-6">
             <div className="text-6xl mb-4">{selectedExercise.imageEmoji}</div>
             <div className="bg-zinc-800 rounded-3xl p-8 mb-4">
               <div className="text-5xl font-bold font-mono text-violet-400">
                 {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
               </div>
             </div>
             <div className="flex gap-2 justify-center mb-6">
               <Button
                 variant={isTimerActive ? 'secondary' : 'primary'}
                 onClick={() => setIsTimerActive(!isTimerActive)}
               >
                 {isTimerActive ? '⏸ Pause' : '▶ Start'}
               </Button>
               <Button
                 variant="secondary"
                 onClick={() => {
                   setTimeRemaining(selectedExercise.durationSeconds);
                   setIsTimerActive(false);
                 }}
               >
                 ↻ Reset
               </Button>
             </div>
           </div>
           <p className="text-zinc-300 leading-relaxed">{selectedExercise.description}</p>
         </Modal>
       )}
     </div>
   );
 }
