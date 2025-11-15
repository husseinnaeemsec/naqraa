import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
}

export default function FormInput({ 
  label, 
  error = false, 
  helperText, 
  className = '', 
  id,
  ...props 
}: FormInputProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId} 
          className={error ? 'text-rose-500' : ''}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? 'true' : 'false'}
        className={`p-2 border w-full rounded-md ${
          error ? 'border-rose-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {helperText && (
        <p className={`text-sm ${error ? 'text-rose-500' : 'text-gray-600'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
