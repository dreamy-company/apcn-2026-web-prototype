import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { BackButton } from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import GoogleIcon from '../../components/ui/GoogleIcon';
import { Divider } from '../../components/ui/bits';
import { D } from '../../data/icons';

export default function SignUpScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthLayout>
      <div className="animate-screen-in">
        <div className="pt-2">
          <BackButton to="/" />
        </div>
        <div className="mt-[18px] mb-[22px]">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Create your account</h1>
          <p className="mt-2 text-[15px] leading-normal text-ink-soft">
            Join delegates from across Asia Pacific.
          </p>
        </div>

        <Button variant="social" icon={<GoogleIcon />} onClick={() => navigate('/otp')}>
          Continue with Google
        </Button>
        <div className="h-[18px]" />
        <Divider label="or with email" />
        <div className="h-[18px]" />

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/otp');
          }}
        >
          <Field
            label="Email address"
            value={email}
            onChange={setEmail}
            placeholder="you@hospital.org"
            type="email"
            icon={<Icon d={D.mail} s={18} />}
          />
          <Field
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="At least 8 characters"
            type="password"
            icon={<Icon d={D.lock} s={18} />}
            hint="At least 8 characters"
          />
          <div className="mt-4 flex flex-col gap-4">
            <Button type="submit">Create account</Button>
            <p className="text-center text-[12.5px] leading-relaxed text-ink-faint">
              By continuing you agree to APCN's <span className="font-semibold text-brand">Terms</span> &amp;{' '}
              <span className="font-semibold text-brand">Privacy Policy</span>.
            </p>
            <p className="text-center text-[14.5px] text-ink-soft">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-brand">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
