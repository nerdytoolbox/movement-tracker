import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { ReminderConfig } from '../types';

const DEFAULT_REMINDERS: ReminderConfig[] = [
  { id: 'reminder-0', label: 'Morning move', time: '08:00', enabled: false, message: 'Time for your morning movement snack! 🌅', days: [1, 2, 3, 4, 5] },
  { id: 'reminder-1', label: 'Desk break', time: '14:00', enabled: false, message: 'Stand up and move for 5 minutes 💻', days: [1, 2, 3, 4, 5] },
  { id: 'reminder-2', label: 'Handstand practice', time: '17:00', enabled: false, message: 'Handstand time! Even 2 kick-ups count 🙃', days: [1, 2, 3, 4, 5] },
  { id: 'reminder-3', label: 'Pre-crochet wrist care', time: '19:00', enabled: false, message: 'Before you crochet: wrist circles! 🤲', days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 'reminder-4', label: 'Evening wind-down', time: '21:00', enabled: false, message: 'A few minutes of stretching before bed 🌙', days: [0, 1, 2, 3, 4, 5, 6] },
];

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function RemindersScreen() {
  const { reminders, saveReminders } = useApp();

  const effectiveReminders: ReminderConfig[] = reminders.length > 0 ? reminders : DEFAULT_REMINDERS;

  async function requestNotificationPermission() {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    }
    return false;
  }

  async function toggleReminder(id: string) {
    const updated = effectiveReminders.map(r => {
      if (r.id !== id) return r;
      if (!r.enabled) requestNotificationPermission();
      return { ...r, enabled: !r.enabled };
    });
    await saveReminders(updated);
  }

  async function updateReminderTime(id: string, time: string) {
    const updated = effectiveReminders.map(r => r.id === id ? { ...r, time } : r);
    await saveReminders(updated);
  }

  const notifSupported = 'Notification' in window;
  const notifGranted = notifSupported && Notification.permission === 'granted';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 px-4 pt-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Reminders 🔔</h1>
      <p className="text-zinc-500 text-sm mb-6">Gentle nudges to keep you moving</p>

      {!notifSupported && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-4 text-amber-300 text-sm">
          ⚠️ Browser notifications are not supported. Install as a PWA for reminders.
        </div>
      )}

      {notifSupported && !notifGranted && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mb-4">
          <p className="text-blue-300 text-sm mb-3">Enable notifications to receive movement reminders.</p>
          <Button variant="secondary" size="sm" onClick={requestNotificationPermission}>
            Enable notifications
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {effectiveReminders.map(reminder => (
          <Card key={reminder.id}>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-zinc-100">{reminder.label}</h3>
                </div>
                <p className="text-zinc-500 text-sm mb-2">"{reminder.message}"</p>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={reminder.time}
                    onChange={e => updateReminderTime(reminder.id, e.target.value)}
                    className="bg-zinc-800 text-zinc-200 rounded-lg px-2 py-1 text-sm border border-zinc-700"
                  />
                  <div className="flex gap-1">
                    {DAY_LABELS.map((d, i) => (
                      <span
                        key={i}
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                          reminder.days.includes(i) ? 'bg-violet-500 text-white' : 'bg-zinc-800 text-zinc-600'
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleReminder(reminder.id)}
                className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${
                  reminder.enabled ? 'bg-violet-500' : 'bg-zinc-700'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  reminder.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center text-zinc-600 text-xs">
        Note: Notifications only work when the app is open or installed as a PWA.
      </div>
    </div>
  );
}
