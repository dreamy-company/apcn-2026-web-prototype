import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { BackButton } from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { D } from '../../data/icons';

const LENGTH = 6;

export default function OtpScreen() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(i: number, raw: string) {
    const v = raw.replace(/\D/g, '').slice(-1);
    setDigits((prev) => prev.map((d, j) => (j === i ? v : d)));
    if (v && i < LENGTH - 1) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  return (
    <AuthLayout>
      <div className="animate-screen-in">
        <div className="pt-2">
          <BackButton />
        </div>
        <div className="mt-[18px] mb-2">
          <div className="mb-5 flex h-15 w-15 items-center justify-center rounded-[18px] bg-brand-soft">
            <Icon d={D.phone} s={26} c="#f15a24" sw={1.8} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Verify your number</h1>
          <p className="mt-2.5 text-[15px] leading-normal text-ink-soft">
            We sent a 6-digit code to
            <br />
            <span className="font-bold text-ink">+62 812 3456 7890</span>
          </p>
        </div>

        <div className="mt-[26px] flex gap-2.5">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              aria-label={`Digit ${i + 1}`}
              className={`h-16 w-full min-w-0 flex-1 rounded-2xl border-[1.5px] text-center text-[26px] font-extrabold text-ink outline-none transition-all focus:border-brand focus:shadow-[0_0_0_4px_rgba(241,90,36,0.10)] ${
                d ? 'border-transparent bg-brand-soft' : 'border-line bg-white'
              }`}
            />
          ))}
        </div>

        <p className="mt-6 text-center text-[14.5px] text-ink-soft">
          Didn't get the code? <span className="text-ink-faint">Resend in 0:42</span>
        </p>

        <div className="mt-10 lg:mt-8">
          <Button onClick={() => navigate('/onboarding/personal')}>Verify &amp; continue</Button>
        </div>
      </div>
    </AuthLayout>
  );
}
