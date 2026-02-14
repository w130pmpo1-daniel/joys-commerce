interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface GenericFormProps {
  fields: FormField[];
  initialData: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  title: string;
}

export default function GenericForm({
  fields,
  initialData,
  onSubmit,
  onCancel,
  title,
}: GenericFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        const el = e.currentTarget.querySelector(`[name="${field.name}"]`) as HTMLInputElement;
        data[field.name] = el?.checked ?? true;
      } else if (field.type === 'number') {
        data[field.name] = parseFloat(formData.get(field.name) as string) || 0;
      } else {
        data[field.name] = formData.get(field.name);
      }
    });
    
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-prodex-text mb-4">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-prodex-text mb-1">
                {field.label} {field.required && '*'}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  defaultValue={initialData[field.name] as string ?? ''}
                  required={field.required}
                  rows={3}
                  className="w-full px-4 py-2 border border-prodex-border rounded-lg focus:outline-none focus:ring-2 focus:ring-prodex-primary"
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  defaultValue={initialData[field.name] as string ?? ''}
                  required={field.required}
                  className="w-full px-4 py-2 border border-prodex-border rounded-lg focus:outline-none focus:ring-2 focus:ring-prodex-primary"
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={field.name}
                    defaultChecked={initialData[field.name] as boolean ?? true}
                    className="w-4 h-4 text-prodex-primary border-prodex-border rounded focus:ring-prodex-primary"
                  />
                  <span className="text-sm text-prodex-text">{field.label}</span>
                </label>
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  name={field.name}
                  defaultValue={initialData[field.name] as number ?? 0}
                  required={field.required}
                  step="any"
                  className="w-full px-4 py-2 border border-prodex-border rounded-lg focus:outline-none focus:ring-2 focus:ring-prodex-primary"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  defaultValue={initialData[field.name] as string ?? ''}
                  required={field.required}
                  className="w-full px-4 py-2 border border-prodex-border rounded-lg focus:outline-none focus:ring-2 focus:ring-prodex-primary"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-prodex-muted hover:text-prodex-text border border-prodex-border rounded-lg hover:bg-prodex-bg-alt transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-prodex-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
