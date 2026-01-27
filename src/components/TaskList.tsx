import { Task } from '@/types/planner';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';
import { Target } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onRemove: (taskId: string) => void;
  onAdd: (task: { title: string; completed: boolean; effort: Task['effort'] }) => void;
}

export function TaskList({ tasks, onToggle, onUpdate, onRemove, onAdd }: TaskListProps) {
  return (
    <div className="space-y-4 animate-gentle-fade" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-medium text-muted-foreground">
          Today's Priorities ({tasks.length}/3)
        </h2>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div key={task.id} style={{ animationDelay: `${0.1 * index}s` }} className="animate-float-up">
            <TaskItem
              task={task}
              onToggle={() => onToggle(task.id)}
              onUpdate={(updates) => onUpdate(task.id, updates)}
              onRemove={() => onRemove(task.id)}
            />
          </div>
        ))}
      </div>

      <AddTaskForm onAdd={onAdd} disabled={tasks.length >= 3} />
    </div>
  );
}
