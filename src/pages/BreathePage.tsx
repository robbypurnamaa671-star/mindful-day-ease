import { Navigation } from '@/components/Navigation';
import { PageHeader } from '@/components/PageHeader';
import { BreathingExercise } from '@/components/BreathingExercise';

const BreathePage = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <PageHeader 
          title="Breathe" 
          subtitle="Take a moment to center yourself"
        />
        
        <BreathingExercise />
      </div>
      
      <Navigation />
    </div>
  );
};

export default BreathePage;
