import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { BackButton } from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import { D } from '../../data/icons';

function OnboardingProgress({ pct, step }: { pct: number; step: string }) {
  return (
    <div className="flex items-center gap-3.5 pt-2">
      <BackButton />
      <div className="h-1.5 flex-1 overflow-hidden rounded-[3px] bg-line">
        <div
          className="h-full rounded-[3px] bg-brand transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-[13px] font-bold whitespace-nowrap text-ink-soft">{step}</span>
    </div>
  );
}

export { OnboardingProgress };

export default function PersonalInfoScreen() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [country, setCountry] = useState('Indonesia');
  const [phone, setPhone] = useState('');

  return (
    <AuthLayout>
      <div className="animate-screen-in">
        <OnboardingProgress pct={50} step="Step 1 of 2" />
        <div className="mt-[18px] mb-5">
          <h1 className="text-[28px] font-extrabold tracking-tight text-ink">Personal information</h1>
          <p className="mt-2 text-[14.5px] text-ink-soft">We use this for your ticket and certificate.</p>
        </div>

        <form
          className="flex flex-col gap-3.5"
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/onboarding/role');
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" required value={firstName} onChange={setFirstName} placeholder="Amelia" />
            <Field label="Last name" required value={lastName} onChange={setLastName} placeholder="Tan" />
          </div>
          <Field
            label="Full name (for certificate)"
            required
            value={fullName}
            onChange={setFullName}
            placeholder="Dr. Amelia Tan"
            icon={<Icon d={D.user} s={18} />}
          />
          <div>
            <div className="mb-2.5 ml-0.5 text-[13px] font-semibold text-ink-soft">
              Gender <span className="text-warm">*</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['Female', 'Male'] as const).map((g) => {
                const on = gender === g;
                return (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGender(g)}
                    className={`relative flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] transition-all ${
                      on ? 'border-brand bg-brand-soft' : 'border-[#ded9d2] bg-white hover:border-ink-faint'
                    }`}
                  >
                    {on && (
                      <span className="absolute top-2.5 right-2.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand">
                        <Icon d={D.check} s={13} c="#fff" sw={3} />
                      </span>
                    )}
                    <Icon d={D.user} s={26} c={on ? '#f15a24' : '#8a8580'} sw={1.8} />
                    <span className={`text-[15px] font-bold ${on ? 'text-brand' : 'text-ink'}`}>{g}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <Field
            label="Country"
            required
            value={country}
            onChange={setCountry}
            icon={<Icon d={D.globe} s={18} />}
            trailing={<Icon d={D.chev} s={18} c="#b8b3ab" />}
          />
          <Field
            label="Phone number"
            required
            value={phone}
            onChange={setPhone}
            placeholder="+62 812 3456 7890"
            type="tel"
            icon={<Icon d={D.phone} s={18} />}
          />
          <div className="mt-4 pb-2">
            <Button type="submit">Next: how you're attending</Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
