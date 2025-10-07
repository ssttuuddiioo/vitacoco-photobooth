// Reusable countdown timer display component

interface CountdownTimerProps {
  count: number;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const CountdownTimer = ({
  count,
  className = '',
  size = 'large',
}: CountdownTimerProps) => {
  const sizeClasses = {
    small: 'text-5xl',
    medium: 'text-7xl',
    large: 'text-9xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} font-bold text-white animate-scale-in drop-shadow-2xl ${className}`}
      key={count}
    >
      {count}
    </div>
  );
};

