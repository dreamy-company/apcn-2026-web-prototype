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

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthLayout>
      <div className="animate-screen-in">
        <div className="pt-2">
          <BackButton to="/" />
        </div>
        <div className="mt-[18px] mb-6 flex flex-col items-start gap-[18px]">
          <div className="text-[22px] font-extrabold tracking-tight text-brand lg:hidden">APSN</div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink">Welcome back</h1>
            <p className="mt-2 text-[15px] text-ink-soft">Log in to manage your tickets.</p>
          </div>
        </div>

        <Button variant="social" icon={<GoogleIcon />} onClick={() => navigate('/dashboard')}>
          Continue with Google
        </Button>
        <div className="h-[18px]" />
        <Divider label="or" />
        <div className="h-[18px]" />

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/dashboard');
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
            placeholder="Your password"
            type="password"
            icon={<Icon d={D.lock} s={18} />}
          />
          <div className="text-right">
            <Link to="/forgot" className="text-sm font-bold text-brand">
              Forgot password?
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <Button type="submit">Log in</Button>
            <p className="text-center text-[14.5px] text-ink-soft">
              New to APCN?{' '}
              <Link to="/signup" className="font-bold text-brand">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
