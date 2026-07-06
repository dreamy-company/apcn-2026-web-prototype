import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { BackButton } from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import { D } from '../../data/icons';

export default function ForgotScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <AuthLayout>
      <div className="animate-screen-in">
        <div className="pt-2">
          <BackButton to="/login" />
        </div>
        <div className="mt-[18px] mb-2">
          <div className="mb-5 flex h-15 w-15 items-center justify-center rounded-[18px] bg-warm-soft">
            <Icon d={D.lock} s={26} c="#2b2b2b" sw={1.8} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Reset password</h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
            Enter the email linked to your account and we'll send a reset link.
          </p>
        </div>

        <div className="mt-[26px]">
          <Field
            label="Email address"
            value={email}
            onChange={setEmail}
            placeholder="you@hospital.org"
            type="email"
            icon={<Icon d={D.mail} s={18} />}
          />
        </div>

        {sent && (
          <div className="mt-4 flex animate-screen-in items-center gap-2.5 rounded-2xl border border-good/20 bg-good-soft px-4 py-3">
            <Icon d={D.check} s={17} c="#3f9a78" sw={2.5} />
            <span className="text-[13px] font-bold text-good">Reset link sent — check your inbox.</span>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 lg:mt-8">
          <Button onClick={() => (sent ? navigate('/login') : setSent(true))}>
            {sent ? 'Back to log in' : 'Send reset link'}
          </Button>
          <p className="text-center text-[14.5px] text-ink-soft">
            Remembered it?{' '}
            <Link to="/login" className="font-bold text-brand">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
