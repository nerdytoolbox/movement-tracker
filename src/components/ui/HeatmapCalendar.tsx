import type { MovementLog } from '../../types';
import { getLast365Days, toDateString } from '../../utils/date';

interface HeatmapCalendarProps {
  logs: MovementLog[];
}

export function HeatmapCalendar({ logs }: HeatmapCalendarProps) {
  const logDates = new Set(logs.map(l => l.date));
  const today = toDateString();
  
  const days = getLast365Days().slice(-182);
  
  const firstDate = new Date(days[0] + 'T00:00:00');
  const startDow = firstDate.getDay();
  const padded: (string | null)[] = [
    ...Array(startDow).fill(null),
    ...days,
  ];
  
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-0">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={day || ''}
                className={`w-3 h-3 rounded-sm transition-colors ${
                  !day
                    ? 'bg-transparent'
                    : day === today
                    ? logDates.has(day)
                      ? 'bg-violet-400 ring-1 ring-violet-300'
                      : 'bg-zinc-700 ring-1 ring-zinc-500'
                    : logDates.has(day)
                    ? 'bg-violet-600'
                    : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
