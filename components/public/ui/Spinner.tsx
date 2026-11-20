import type { HTMLAttributes } from 'react';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

export default function Spinner({
  size = 'md',
  label,
  className = '',
  ...props
}: SpinnerProps) {
  return (
    <div
      className={[
        'inline-flex items-center gap-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span
        role="status"
        aria-label={label}
        className={[
          'animate-spin rounded-full',
          'border-gray-300 border-t-gray-900',
          sizes[size],
        ].join(' ')}
      />

      {label && (
        <span className="text-sm text-gray-500">
          {label}
        </span>
      )}
    </div>
  );
}