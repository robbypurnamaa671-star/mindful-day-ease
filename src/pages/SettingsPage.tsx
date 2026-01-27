import { usePlanner } from '@/hooks/usePlanner';
import { useHaptics } from '@/hooks/useHaptics';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';
import { Bell, Vibrate, Moon, Sun, Smartphone, Heart, Volume2 } from 'lucide-react';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { settings, updateSettings } = usePlanner();
  const { softTap } = useHaptics();

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const toggleSetting = (key: keyof typeof settings) => {
    softTap();
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="container max-w-lg mx-auto px-4">
        <PageHeader
          title="Settings"
          subtitle="Customize your experience"
        />

        <div className="space-y-4">
          <div className="card-mindful animate-gentle-fade">
            <h2 className="text-sm font-medium text-muted-foreground mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <SettingToggle
                icon={Bell}
                label="Gentle Reminders"
                description="Daily nudges to reflect"
                checked={settings.remindersEnabled}
                onChange={() => toggleSetting('remindersEnabled')}
              />

              <SettingToggle
                icon={Vibrate}
                label="Haptic Feedback"
                description="Soft vibrations on actions"
                checked={settings.hapticsEnabled}
                onChange={() => toggleSetting('hapticsEnabled')}
              />

              <SettingToggle
                icon={Volume2}
                label="Meditation Sounds"
                description="Gentle chimes during breathing"
                checked={settings.soundsEnabled}
                onChange={() => toggleSetting('soundsEnabled')}
              />

              <SettingToggle
                icon={settings.darkMode ? Moon : Sun}
                label="Dark Mode"
                description="Easier on the eyes at night"
                checked={settings.darkMode}
                onChange={() => toggleSetting('darkMode')}
              />
            </div>
          </div>

          <div className="card-mindful animate-gentle-fade" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-sm font-medium text-muted-foreground mb-4">About</h2>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4" />
                <span>Your data stays on this device</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-destructive" />
                <span>Made with calm intention</span>
              </div>
            </div>
          </div>

          <div className="text-center py-8 animate-gentle-fade" style={{ animationDelay: '0.2s' }}>
            <p className="text-xs text-muted-foreground/60">
              Mindful Day Planner
            </p>
            <p className="text-xs text-muted-foreground/40 mt-1">
              Less tasks. More awareness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center justify-between p-1 -m-1 rounded-xl hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="text-left">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      <div className={cn(
        'w-12 h-7 rounded-full transition-all duration-300 p-1',
        checked ? 'bg-primary' : 'bg-muted'
      )}>
        <div className={cn(
          'w-5 h-5 rounded-full bg-card shadow-sm transition-transform duration-300',
          checked && 'translate-x-5'
        )} />
      </div>
    </button>
  );
}
