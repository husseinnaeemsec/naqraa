interface ErrorObject {
  [key: string]: string[] | undefined;
}

interface FormErrorsProps {
  errors: ErrorObject | string[];
}

export default function FormErrors({ errors }: FormErrorsProps) {
  if (Array.isArray(errors)) {
    if (errors.length === 0) return null;
    
    return (
      <div className="bg-rose-50 p-2 rounded text-rose-500">
        {errors.map((error, i) => (
          <p key={i} className="text-center">{error}</p>
        ))}
      </div>
    );
  }

  const errorEntries = Object.entries(errors);
  if (errorEntries.length === 0) return null;

  return (
    <div className="space-y-1">
      {errorEntries.map(([field, messages]) =>
        messages ? (
          <div key={field} className="bg-rose-50 p-1.5 rounded text-red-500">
            <ul className={field !== 'non_field_errors' ? 'pl-3' : ''}>
              {messages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
}
