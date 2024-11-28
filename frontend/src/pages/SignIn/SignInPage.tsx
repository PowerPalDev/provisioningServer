import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ForgotPassword from './ForgotPasswordPage';
import { useSignInForm } from '../../hooks/useSignIn';

export default function SignIn() {
  const [open, setOpen] = useState(false);

  const {
    emailError,
    emailErrorMessage,
    passwordError,
    passwordErrorMessage,
    showPassword,
    setShowPassword,
    handleSignIn,
  } = useSignInForm();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleOpenForgotPassword = () => {
    setOpen(true);
  };

  const handleCloseForgotPassword = () => {
    setOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    handleSignIn(data.get('email') as string, data.get('password') as string);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 p-3">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '450px' }}>
        <h1 className="text-center mb-4" style={{ fontSize: '2rem' }}>
          Sign in
        </h1>
        <form onSubmit={handleFormSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className={`form-control ${emailError ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              autoFocus
            />
            {emailError && <div className="invalid-feedback">{emailErrorMessage}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                placeholder="••••••"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {passwordError && <div className="invalid-feedback">{passwordErrorMessage}</div>}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                value="remember"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#" className="text-decoration-none" onClick={handleOpenForgotPassword}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign in
          </button>
        </form>
      </div>

      {open && <ForgotPassword open={open} onClose={handleCloseForgotPassword} />}
    </div>
  );
}
