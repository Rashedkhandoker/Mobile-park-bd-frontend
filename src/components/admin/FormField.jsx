'use client';

export default function FormField({ label, name, type = 'text', value, onChange, options, required, placeholder, rows }) {
  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0',
    borderRadius: 8, fontSize: '0.875rem', color: '#1a202c', outline: 'none',
    background: '#fff',
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#e53e3e', marginLeft: 2 }}>*</span>}
      </label>
      {type === 'select' ? (
        <select name={name} value={value} onChange={onChange} style={inputStyle} required={required}>
          <option value="">Select {label}</option>
          {options?.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} value={value} onChange={onChange} style={{ ...inputStyle, resize: 'vertical', minHeight: rows ? rows * 24 : 80 }} placeholder={placeholder} required={required} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} style={inputStyle} placeholder={placeholder} required={required} />
      )}
    </div>
  );
}
