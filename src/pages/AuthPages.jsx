import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button, Input } from '../components/UI';
import './AuthPages.css';

export function SignInPage() {
  const { setCurrentPage, setUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setUser({ email, name: 'User' });
    setCurrentPage('dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-illustration hide-mobile">
          <div className="auth-blob blob-1"></div>
          <div className="auth-blob blob-2"></div>
          <div className="auth-icon">🔐</div>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your TransformIt account</p>
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
            <Button type="submit" variant="primary" className="btn-full">
              Sign In
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <button
                className="text-link"
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
  const { setCurrentPage, setUser } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
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
    setUser({ email, name });
    setCurrentPage('dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-illustration hide-mobile">
          <div className="auth-blob blob-1"></div>
          <div className="auth-blob blob-2"></div>
          <div className="auth-icon">🚀</div>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Join TransformIt</h1>
            <p>Create your account and start creating campaigns</p>
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
            <Button type="submit" variant="primary" className="btn-full">
              Create Account
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <button
                className="text-link"
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
