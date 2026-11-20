import type {
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  endAdornment?: ReactNode;
}

export default function Textarea({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: TextareaProps) {
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

      <textarea
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
          'min-h-[120px]',
          'resize-y',
          'bg-white text-sm text-gray-900',
          'outline-none transition',
          'placeholder:text-gray-400',
          'focus:border-gray-900',
          'focus:ring-1 focus:ring-gray-900',
          'disabled:cursor-not-allowed',
          'disabled:bg-gray-100',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

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