import { useState, type ReactNode } from 'react';
import Icon from './Icon';
import { D } from '../../data/icons';

interface FieldProps {
  label?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  required?: boolean;
  area?: boolean;
  hint?: string;
  name?: string;
}

export default function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  trailing,
  required,
  area,
  hint,
  name,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && show ? 'text' : type;

  const shared = {
    name,
    value,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      'w-full flex-1 bg-transparent text-[16px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint',
  };

  return (
    <label className="block">
      {label && (
        <div className="mb-[7px] ml-0.5 text-[13px] font-semibold text-ink-soft">
          {label}
          {required && <span className="ml-[3px] text-warm">*</span>}
        </div>
      )}
      <div
        className={`flex gap-3 rounded-2xl border-[1.5px] transition-all duration-150 ${
          area ? 'min-h-[90px] items-start px-4 py-3.5' : 'h-14 items-center px-4'
        } ${
          focused
            ? 'border-brand bg-white shadow-[0_0_0_4px_rgba(241,90,36,0.10)]'
            : 'border-[#ded9d2] bg-field'
        }`}
      >
        {icon && <span className={`flex ${focused ? 'text-brand' : 'text-ink-faint'}`}>{icon}</span>}
        {area ? (
          <textarea {...shared} rows={3} className={`${shared.className} resize-none leading-relaxed`} />
        ) : (
          <input {...shared} type={inputType} />
        )}
        {isPassword ? (
          <button type="button" tabIndex={-1} onMouseDown={(e) => e.preventDefault()} onClick={() => setShow(!show)} className="flex">
            <Icon d={D.eye} s={19} c={show ? '#f15a24' : '#b8b3ab'} />
          </button>
        ) : (
          trailing
        )}
      </div>
      {hint && <div className="mt-1.5 ml-0.5 text-xs text-ink-faint">{hint}</div>}
    </label>
  );
}
