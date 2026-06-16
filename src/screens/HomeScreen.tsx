import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { HeatmapCalendar } from '../components/ui/HeatmapCalendar';
import { toDateString } from '../utils/date';

export function HomeScreen() {
  const { logs, todayLog, recordMovement, streakInfo, loading } = useApp();
  const [celebrating, setCelebrating] = useState(false);

  if (loading) return <div className="flex items-center justify-center h-screen text-zinc-500">Loading...</div>;

  const streak = streakInfo();
  const hasMovedToday = !!todayLog;

  async function handleMovement() {
    await recordMovement();
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 px-4 pt-8 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-zinc-500 text-sm mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h1 className="text-3xl font-bold">
          {hasMovedToday ? '✨ You moved today!' : 'Ready to move?'}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="text-center">
          <div className="text-4xl font-bold text-violet-400">{streak.current}</div>
          <div className="text-zinc-500 text-sm mt-1">day streak 🔥</div>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-amber-400">{streak.longest}</div>
          <div className="text-zinc-500 text-sm mt-1">best streak ⭐</div>
        </Card>
      </div>

      <div className="mb-6">
        {hasMovedToday ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 text-center">
            <div className="text-5xl mb-2">{celebrating ? '🎉' : '✅'}</div>
            <p className="text-emerald-400 font-semibold text-lg">Movement logged!</p>
            <p className="text-zinc-500 text-sm mt-1">
              {(todayLog?.snacksCompleted.length ?? 0) + (todayLog?.routinesCompleted.length ?? 0)} activities today
            </p>
            <Button variant="ghost" size="sm" className="mt-3" onClick={handleMovement}>
              + Log more
            </Button>
          </div>
        ) : (
          <Button
            size="xl"
            onClick={handleMovement}
            className={celebrating ? 'scale-105' : ''}
          >
            {celebrating ? '🎉 Logged!' : '✊ I touched movement today'}
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <div className="flex justify-between text-center">
          <div>
            <div className="text-2xl font-bold text-zinc-100">{streak.totalDays}</div>
            <div className="text-zinc-500 text-xs">total days</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">
              {logs.filter(l => l.date.startsWith(toDateString().slice(0, 7))).length}
            </div>
            <div className="text-zinc-500 text-xs">this month</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">
              {logs.reduce((sum, l) => sum + l.snacksCompleted.length + l.routinesCompleted.length, 0)}
            </div>
            <div className="text-zinc-500 text-xs">activities</div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-zinc-400 mb-4">Movement history</h2>
        <HeatmapCalendar logs={logs} />
        <p className="text-xs text-zinc-600 mt-3">Each square = one day. Purple = moved ✓</p>
      </Card>
    </div>
  );
}
