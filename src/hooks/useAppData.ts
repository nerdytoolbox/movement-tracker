import { useState, useEffect, useCallback } from 'react';
import type { MovementLog, SkillProgress, ReminderConfig, AppSettings, StreakInfo } from '../types';
import { getAllLogs, saveMovementLog, getStateValue, setStateValue } from '../utils/db';
import { toDateString, isToday } from '../utils/date';

export function useAppData() {
  const [logs, setLogs] = useState<MovementLog[]>([]);
  const [favoriteSnacks, setFavoriteSnacks] = useState<string[]>([]);
  const [skillProgress, setSkillProgress] = useState<Record<string, SkillProgress>>({});
  const [reminders, setReminders] = useState<ReminderConfig[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ darkMode: 'auto', notificationsEnabled: false });
  const [loading, setLoading] = useState(true);
  const [todayLog, setTodayLog] = useState<MovementLog | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [allLogs, favSnacks, skillProg, rems, setts] = await Promise.all([
          getAllLogs(),
          getStateValue<string[]>('favoriteSnacks', []),
          getStateValue<Record<string, SkillProgress>>('skillProgress', {}),
          getStateValue<ReminderConfig[]>('reminders', []),
          getStateValue<AppSettings>('settings', { darkMode: 'auto', notificationsEnabled: false }),
        ]);
        setLogs(allLogs.sort((a, b) => a.date.localeCompare(b.date)));
        setFavoriteSnacks(favSnacks);
        setSkillProgress(skillProg);
        setReminders(rems);
        setSettings(setts);
        const today = allLogs.find(l => isToday(l.date)) || null;
        setTodayLog(today);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const recordMovement = useCallback(async (snackId?: string, routineId?: string) => {
    const today = toDateString();
    const existing = logs.find(l => l.date === today);
    const log: MovementLog = existing ? { ...existing } : {
      id: `log-${today}`,
      date: today,
      timestamp: Date.now(),
      snacksCompleted: [],
      routinesCompleted: [],
    };

    if (snackId && !log.snacksCompleted.includes(snackId)) {
      log.snacksCompleted = [...log.snacksCompleted, snackId];
    }
    if (routineId && !log.routinesCompleted.includes(routineId)) {
      log.routinesCompleted = [...log.routinesCompleted, routineId];
    }
    log.timestamp = Date.now();

    await saveMovementLog(log);
    setLogs(prev => {
      const filtered = prev.filter(l => l.date !== today);
      return [...filtered, log].sort((a, b) => a.date.localeCompare(b.date));
    });
    setTodayLog(log);
  }, [logs]);

  const toggleFavoriteSnack = useCallback(async (snackId: string) => {
    const updated = favoriteSnacks.includes(snackId)
      ? favoriteSnacks.filter(id => id !== snackId)
      : [...favoriteSnacks, snackId];
    setFavoriteSnacks(updated);
    await setStateValue('favoriteSnacks', updated);
  }, [favoriteSnacks]);

  const updateSkillMilestone = useCallback(async (skillId: string, milestoneId: string, completed: boolean) => {
    const current = skillProgress[skillId] || { skillId, milestones: {} };
    const updated = {
      ...skillProgress,
      [skillId]: {
        ...current,
        milestones: { ...current.milestones, [milestoneId]: completed },
      },
    };
    if (!updated[skillId].startedAt) updated[skillId].startedAt = Date.now();
    setSkillProgress(updated);
    await setStateValue('skillProgress', updated);
  }, [skillProgress]);

  const saveReminders = useCallback(async (newReminders: ReminderConfig[]) => {
    setReminders(newReminders);
    await setStateValue('reminders', newReminders);
  }, []);

  const streakInfo = useCallback((): StreakInfo => {
    const logDates = new Set(logs.map(l => l.date));
    
    let current = 0;
    let longest = 0;
    const today = toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toDateString(yesterday);
    
    const streakAlive = logDates.has(today) || logDates.has(yesterdayStr);
    
    if (streakAlive) {
      const d = new Date();
      if (!logDates.has(today)) d.setDate(d.getDate() - 1);
      
      while (logDates.has(toDateString(d))) {
        current++;
        d.setDate(d.getDate() - 1);
      }
    }
    
    const sortedDates = [...logDates].sort();
    let tempStreak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(sortedDates[i - 1] + 'T00:00:00');
        const curr = new Date(sortedDates[i] + 'T00:00:00');
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      longest = Math.max(longest, tempStreak);
    }
    
    return {
      current,
      longest,
      totalDays: logDates.size,
      lastMovementDate: sortedDates[sortedDates.length - 1] || null,
    };
  }, [logs]);

  return {
    loading,
    logs,
    todayLog,
    favoriteSnacks,
    skillProgress,
    reminders,
    settings,
    recordMovement,
    toggleFavoriteSnack,
    updateSkillMilestone,
    saveReminders,
    streakInfo,
  };
}
