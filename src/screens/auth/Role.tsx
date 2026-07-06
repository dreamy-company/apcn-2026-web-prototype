import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { D } from '../../data/icons';
import { OnboardingProgress } from './PersonalInfo';

const ROLES = [
  { k: 'Physician', sub: 'Nephrologist / clinician' },
  { k: 'Researcher', sub: 'Academic / scientist' },
  { k: 'Industry', sub: 'Sponsor / partner' },
  { k: 'Delegate', sub: 'General attendee' },
];

export default function RoleScreen() {
  const navigate = useNavigate();
  const [role, setRole] = useState('Physician');

  return (
    <AuthLayout>
      <div className="animate-screen-in">
        <OnboardingProgress pct={100} step="Step 2 of 2" />
        <div className="mt-[18px] mb-[22px]">
          <h1 className="text-[28px] font-extrabold tracking-tight text-ink">I'm attending as a…</h1>
          <p className="mt-2 text-[14.5px] text-ink-soft">This personalises your program and badge.</p>
        </div>

        <div className="flex flex-col gap-3">
          {ROLES.map((r) => {
            const on = role === r.k;
            return (
              <button
                type="button"
                key={r.k}
                onClick={() => setRole(r.k)}
                className={`flex items-center gap-3.5 rounded-2xl border-[1.5px] px-[18px] py-4 text-left transition-all ${
                  on
                    ? 'border-brand bg-brand shadow-[0_12px_26px_-12px_rgba(241,90,36,0.55)]'
                    : 'border-[#ded9d2] bg-white hover:border-ink-faint'
                }`}
              >
                <span className="flex-1">
                  <span className={`block text-[17px] font-bold ${on ? 'text-white' : 'text-ink'}`}>{r.k}</span>
                  <span className={`mt-0.5 block text-[13px] font-medium ${on ? 'text-white/80' : 'text-ink-faint'}`}>
                    {r.sub}
                  </span>
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    on ? 'border-white/90 bg-white' : 'border-line bg-transparent'
                  }`}
                >
                  {on && <Icon d={D.check} s={14} c="#f15a24" sw={3} />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          <Button onClick={() => navigate('/welcome')}>Finish setup</Button>
        </div>
      </div>
    </AuthLayout>
  );
}
