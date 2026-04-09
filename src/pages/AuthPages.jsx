import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button, Input } from '../components/UI';
import './AuthPages.css';

export function SignInPage() {
  const { setCurrentPage, signIn } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await signIn({ email, password });
      setCurrentPage('dashboard');
    } catch (err) {
      setError(err?.message || 'Could not sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-illustration hide-mobile">
          <div className="auth-blob blob-1"></div>
          <div className="auth-blob blob-2"></div>
          <div className="auth-icon">Campaign studio</div>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to continue your campaign workflow.</p>
          </div>

          <form onSubmit={handleSignIn} className="auth-form">
            <Input
              type="email"
              placeholder="your@email.com"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="••••••••"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="form-error-message">{error}</div>}
            <Button type="submit" variant="primary" className="btn-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <button
                className="text-link"
                type="button"
                onClick={() => setCurrentPage('signup')}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignUpPage() {
  const { setCurrentPage, signUp } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await signUp({ name, email, password });
      if (result?.session?.user) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('signin');
      }
    } catch (err) {
      setError(err?.message || 'Could not create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-illustration hide-mobile">
          <div className="auth-blob blob-1"></div>
          <div className="auth-blob blob-2"></div>
          <div className="auth-icon">Bloomboard workspace</div>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Create your account</h1>
            <p>Set up your workspace and start building campaigns.</p>
          </div>

          <form onSubmit={handleSignUp} className="auth-form">
            <Input
              type="text"
              placeholder="John Doe"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="your@email.com"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="••••••••"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="••••••••"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <div className="form-error-message">{error}</div>}
            <Button type="submit" variant="primary" className="btn-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <button
                className="text-link"
                type="button"
                onClick={() => setCurrentPage('signin')}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
