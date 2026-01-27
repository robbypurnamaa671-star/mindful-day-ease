import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DayEntry, Task, MoodLevel, EnergyLevel, AppSettings } from '@/types/planner';

const getTodayKey = () => new Date().toISOString().split('T')[0];

const createEmptyDay = (date: string): DayEntry => ({
  date,
  intention: '',
  mood: null,
  energy: null,
  tasks: [],
});

const defaultSettings: AppSettings = {
  remindersEnabled: true,
  hapticsEnabled: true,
  soundsEnabled: true,
  darkMode: false,
};

export function usePlanner() {
  const [entries, setEntries] = useLocalStorage<Record<string, DayEntry>>('mindful-planner-entries', {});
  const [settings, setSettings] = useLocalStorage<AppSettings>('mindful-planner-settings', defaultSettings);

  const todayKey = getTodayKey();

  const today = useMemo(() => {
    return entries[todayKey] || createEmptyDay(todayKey);
  }, [entries, todayKey]);

  const updateToday = useCallback((updates: Partial<DayEntry>) => {
    setEntries((prev) => ({
      ...prev,
      [todayKey]: { ...today, ...updates },
    }));
  }, [setEntries, todayKey, today]);

  const setIntention = useCallback((intention: string) => {
    updateToday({ intention });
  }, [updateToday]);

  const setMood = useCallback((mood: MoodLevel) => {
    updateToday({ mood });
  }, [updateToday]);

  const setEnergy = useCallback((energy: EnergyLevel) => {
    updateToday({ energy });
  }, [updateToday]);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    if (today.tasks.length >= 3) return;
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
    };
    updateToday({ tasks: [...today.tasks, newTask] });
  }, [today.tasks, updateToday]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const updatedTasks = today.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    updateToday({ tasks: updatedTasks });
  }, [today.tasks, updateToday]);

  const toggleTaskComplete = useCallback((taskId: string) => {
    const task = today.tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(taskId, { completed: !task.completed });
    }
  }, [today.tasks, updateTask]);

  const removeTask = useCallback((taskId: string) => {
    updateToday({ tasks: today.tasks.filter((t) => t.id !== taskId) });
  }, [today.tasks, updateToday]);

  const saveReflection = useCallback((reflection: DayEntry['reflection']) => {
    updateToday({ reflection });
  }, [updateToday]);

  const letGo = useCallback(() => {
    const incompleteTasks = today.tasks.filter((t) => !t.completed);
    const tomorrowKey = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    setEntries((prev) => {
      const tomorrowEntry = prev[tomorrowKey] || createEmptyDay(tomorrowKey);
      const movedTasks = incompleteTasks.map((t) => ({ ...t, id: crypto.randomUUID() }));
      
      return {
        ...prev,
        [todayKey]: {
          ...today,
          reflection: { ...today.reflection, letGo: true, wentWell: today.reflection?.wentWell || [] },
        },
        [tomorrowKey]: {
          ...tomorrowEntry,
          tasks: [...tomorrowEntry.tasks, ...movedTasks].slice(0, 3),
        },
      };
    });
  }, [today, todayKey, setEntries]);

  const history = useMemo(() => {
    return Object.values(entries)
      .filter((entry) => entry.date !== todayKey)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, todayKey]);

  const getEntry = useCallback((date: string) => {
    return entries[date];
  }, [entries]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, [setSettings]);

  return {
    today,
    history,
    settings,
    setIntention,
    setMood,
    setEnergy,
    addTask,
    updateTask,
    toggleTaskComplete,
    removeTask,
    saveReflection,
    letGo,
    getEntry,
    updateSettings,
  };
}
