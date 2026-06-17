import { useState, useEffect } from 'react';
import { MOVEMENT_SNACKS } from '../data/snacks';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import type { MovementSnack } from '../types';

export function SnacksScreen() {
  const { favoriteSnacks, toggleFavoriteSnack, todayLog, recordMovement } = useApp();
  const [selectedSnack, setSelectedSnack] = useState<MovementSnack | null>(null);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [completedToday, setCompletedToday] = useState<Set<string>>(
    new Set(todayLog?.snacksCompleted || [])
  );
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    if (selectedSnack && timeRemaining === 0) {
      setTimeRemaining(selectedSnack.durationSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSnack]);

  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  function getRandomSnack() {
    const pool = MOVEMENT_SNACKS.filter(s => !completedToday.has(s.id));
    if (pool.length === 0) return;
    setSelectedSnack(pool[Math.floor(Math.random() * pool.length)]);
  }

  async function markComplete(snack: MovementSnack) {
    await recordMovement(snack.id);
    setCompletedToday(prev => new Set([...prev, snack.id]));
    setSelectedSnack(null);
  }

  const displayed = filter === 'favorites'
    ? MOVEMENT_SNACKS.filter(s => favoriteSnacks.includes(s.id))
    : MOVEMENT_SNACKS;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 px-4 pt-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Movement Snacks 🍿</h1>
        <Button variant="secondary" size="sm" onClick={getRandomSnack}>
          🎲 Random
        </Button>
      </div>

      <div className="flex gap-2 mb-5">
        {(['all', 'favorites'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-violet-500 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {f === 'all' ? 'All snacks' : '⭐ Favorites'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {displayed.map(snack => {
          const isDone = completedToday.has(snack.id);
          const isFav = favoriteSnacks.includes(snack.id);
          return (
            <Card
              key={snack.id}
              onClick={() => {
                setSelectedSnack(snack);
                setTimeRemaining(0);
                setIsTimerActive(false);
              }}
              className={isDone ? 'opacity-60' : ''}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{snack.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-100">{snack.name}</h3>
                    {isDone && <span className="text-emerald-400 text-sm">✓</span>}
                  </div>
                   <p className="text-zinc-500 text-sm truncate">{snack.description}</p>
                   <div className="flex gap-1.5 mt-1.5 flex-wrap">
                     <Badge variant="zinc">{snack.durationSeconds}s</Badge>
                     {snack.tags.slice(0, 2).map(tag => (
                       <Badge key={tag} variant="zinc">{tag}</Badge>
                     ))}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggleFavoriteSnack(snack.id); }}
                  className="text-xl p-1"
                >
                  {isFav ? '⭐' : '☆'}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

       {selectedSnack && (
          <Modal isOpen={true} title={selectedSnack.name} onClose={() => {
            setSelectedSnack(null);
            setIsTimerActive(false);
          }}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedSnack.emoji}</div>
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
                    setTimeRemaining(selectedSnack.durationSeconds);
                    setIsTimerActive(false);
                  }}
                >
                  ↻ Reset
                </Button>
              </div>
            </div>
            <p className="text-zinc-300 mb-4 leading-relaxed">{selectedSnack.description}</p>
           <div className="flex flex-wrap gap-2 mb-6">
             {selectedSnack.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
           </div>
           <Button
             size="xl"
             onClick={() => markComplete(selectedSnack)}
             disabled={completedToday.has(selectedSnack.id)}
           >
             {completedToday.has(selectedSnack.id) ? '✓ Done today!' : '✓ Mark complete'}
           </Button>
         </Modal>
       )}
    </div>
  );
}
