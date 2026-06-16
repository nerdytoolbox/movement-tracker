import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { MOVEMENT_SNACKS } from '../data/snacks';
import { SKILLS } from '../data/skills';
import { exportData } from '../utils/backup';
import { Button } from '../components/ui/Button';

export function StatsScreen() {
  const { logs, skillProgress, streakInfo } = useApp();
  const streak = streakInfo();

  const snackCounts: Record<string, number> = {};
  logs.forEach(l => l.snacksCompleted.forEach(id => { snackCounts[id] = (snackCounts[id] || 0) + 1; }));
  const topSnacks = Object.entries(snackCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ snack: MOVEMENT_SNACKS.find(s => s.id === id), count }))
    .filter(x => x.snack);

  const completedSkills = SKILLS.filter(skill => {
    const progress = skillProgress[skill.id];
    if (!progress) return false;
    return skill.milestones.every(m => progress.milestones[m.id]);
  });

  const dowCounts = [0, 0, 0, 0, 0, 0, 0];
  logs.forEach(l => {
    const dow = new Date(l.date + 'T00:00:00').getDay();
    dowCounts[dow]++;
  });
  const maxDow = Math.max(...dowCounts, 1);
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 px-4 pt-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Stats 📊</h1>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Streak', value: streak.current, unit: 'days 🔥' },
          { label: 'Total', value: streak.totalDays, unit: 'days' },
          { label: 'Best', value: streak.longest, unit: 'days ⭐' },
        ].map(stat => (
          <Card key={stat.label} className="text-center">
            <div className="text-2xl font-bold text-violet-400">{stat.value}</div>
            <div className="text-zinc-500 text-xs mt-1">{stat.unit}</div>
          </Card>
        ))}
      </div>

      <Card className="mb-4">
        <h2 className="font-semibold text-zinc-300 mb-1">This Month</h2>
        {(() => {
          const now = new Date();
          const monthStr = now.toISOString().slice(0, 7);
          const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
          const daysThisMonth = logs.filter(l => l.date.startsWith(monthStr)).length;
          return (
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-zinc-100">{daysThisMonth}</span>
              <span className="text-zinc-500 pb-1">/ {daysInMonth} days</span>
            </div>
          );
        })()}
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold text-zinc-300 mb-3">Active days by weekday</h2>
        <div className="flex gap-2 items-end h-16">
          {DAYS.map((day, i) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-violet-500 rounded-sm transition-all"
                style={{ height: `${(dowCounts[i] / maxDow) * 48}px`, minHeight: '2px' }}
              />
              <span className="text-zinc-600 text-[10px]">{day[0]}</span>
            </div>
          ))}
        </div>
      </Card>

      {topSnacks.length > 0 && (
        <Card className="mb-4">
          <h2 className="font-semibold text-zinc-300 mb-3">Top snacks</h2>
          <div className="space-y-2">
            {topSnacks.map(({ snack, count }) => snack && (
              <div key={snack.id} className="flex items-center gap-2">
                <span className="text-xl">{snack.emoji}</span>
                <span className="text-zinc-300 flex-1 text-sm">{snack.name}</span>
                <span className="text-violet-400 text-sm font-semibold">{count}×</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mb-4">
        <h2 className="font-semibold text-zinc-300 mb-3">Skills completed</h2>
        {completedSkills.length === 0 ? (
          <p className="text-zinc-600 text-sm">No skills completed yet. Keep practicing! 🌱</p>
        ) : (
          <div className="space-y-1">
            {completedSkills.map(skill => (
              <div key={skill.id} className="flex items-center gap-2">
                <span>{skill.emoji}</span>
                <span className="text-emerald-400 text-sm">{skill.name}</span>
                <span className="text-emerald-500 text-xs ml-auto">✓ Complete</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold text-zinc-300 mb-3">Data</h2>
        <Button variant="secondary" onClick={exportData} className="w-full">
          📤 Export backup JSON
        </Button>
      </Card>
    </div>
  );
}
