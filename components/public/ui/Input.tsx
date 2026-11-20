import type {
  InputHTMLAttributes,
  ReactNode,
} from 'react';

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export default function Input({
  label,
  error,
  hint,
  startAdornment,
  endAdornment,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {startAdornment && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {startAdornment}
          </div>
        )}

        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${id}-error`
              : hint
                ? `${id}-hint`
                : undefined
          }
          className={[
            'block w-full rounded-lg border px-4 py-3',
            'text-sm text-gray-900',
            'bg-white',
            'outline-none transition',
            'placeholder:text-gray-400',
            'focus:border-gray-900',
            'focus:ring-1 focus:ring-gray-900',
            'disabled:cursor-not-allowed',
            'disabled:bg-gray-100',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            startAdornment ? 'pl-10' : '',
            endAdornment ? 'pr-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />

        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            {endAdornment}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      {!error && hint && (
        <p
          id={`${id}-hint`}
          className="mt-2 text-xs text-gray-500"
        >
          {hint}
        </p>
      )}
    </div>
  );
}