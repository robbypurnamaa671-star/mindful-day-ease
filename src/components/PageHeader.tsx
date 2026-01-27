import { format } from 'date-fns';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  showDate?: boolean;
}

export function PageHeader({ title, subtitle, showDate = false }: PageHeaderProps) {
  const today = new Date();

  return (
    <header className="pt-8 pb-6 animate-gentle-fade">
      {showDate && (
        <p className="text-sm text-muted-foreground font-medium mb-1">
          {format(today, 'EEEE, MMMM d')}
        </p>
      )}
      {title && (
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      )}
      {subtitle && (
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      )}
    </header>
  );
}
