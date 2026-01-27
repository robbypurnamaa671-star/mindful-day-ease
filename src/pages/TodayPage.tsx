import { usePlanner } from '@/hooks/usePlanner';
import { PageHeader } from '@/components/PageHeader';
import { IntentionInput } from '@/components/IntentionInput';
import { MoodSelector } from '@/components/MoodSelector';
import { EnergySelector } from '@/components/EnergySelector';
import { TaskList } from '@/components/TaskList';

export default function TodayPage() {
  const {
    today,
    setIntention,
    setMood,
    setEnergy,
    addTask,
    updateTask,
    toggleTaskComplete,
    removeTask,
  } = usePlanner();

  return (
    <div className="min-h-screen pb-28">
      <div className="container max-w-lg mx-auto px-4">
        <PageHeader
          showDate
          title="Good morning"
          subtitle="Let's set your intentions for today"
        />

        <div className="space-y-4">
          <IntentionInput value={today.intention} onChange={setIntention} />
          
          <MoodSelector value={today.mood} onChange={setMood} />
          
          <EnergySelector value={today.energy} onChange={setEnergy} />
          
          <TaskList
            tasks={today.tasks}
            onToggle={toggleTaskComplete}
            onUpdate={updateTask}
            onRemove={removeTask}
            onAdd={addTask}
          />
        </div>
      </div>
    </div>
  );
}
