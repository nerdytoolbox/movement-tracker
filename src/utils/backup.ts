import { getAllLogs, getStateValue } from './db';

export async function exportData(): Promise<void> {
  const logs = await getAllLogs();
  const favoriteSnacks = await getStateValue('favoriteSnacks', []);
  const skillProgress = await getStateValue('skillProgress', {});
  const reminders = await getStateValue('reminders', []);
  const settings = await getStateValue('settings', {});

  const data = {
    exportedAt: new Date().toISOString(),
    version: 1,
    logs,
    favoriteSnacks,
    skillProgress,
    reminders,
    settings,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `movement-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<void> {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data.version || !data.logs) throw new Error('Invalid backup file');
}
