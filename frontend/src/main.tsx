// src/Main.tsx
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import AuthGuard from './guards/AuthGuard.tsx';
import PageNotFound from './components/Dialogs/errors/PageNotFound.tsx';
import SignInCard from './pages/SignIn/SignInPage.tsx';
import { isAuthenticated } from './utils/authHelper.ts';
import { initializeErrorHandling } from './services/api/interceptors.ts';
import 'bootstrap/dist/css/bootstrap.min.css';

interface TitleProps {
  title: string;
  children: React.ReactNode;
}

const Title = ({ title, children }: TitleProps) => {
  useEffect(() => {
    document.title = title + ' | PowerPal';
  }, [title]);

  return <>{children}</>;
};

const GlobalStylesComponent = () => {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflowX = 'hidden';
  }, []);
  return null;
};

const Main = () => {
  const [errorText, setErrorText] = useState('');
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);

  const handleCloseErrorPopup = () => {
    setIsErrorPopupOpen(false);
    setErrorText('');
  };

  useEffect(() => {
    initializeErrorHandling(() => setIsErrorPopupOpen(true), setErrorText);
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AuthGuard isAuthenticated={isAuthenticated}>
          <Title title="Home Page">
            <HomePage />
          </Title>
        </AuthGuard>
      ),
      errorElement: <PageNotFound />,
    },
    {
      path: '/signin',
      element: (
        <Title title="Sign In">
          <SignInCard />
        </Title>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      {isErrorPopupOpen && (
        <div
          className="modal fade show"
          tabIndex={-1}
          style={{ display: 'block' }}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Failed</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseErrorPopup}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>{errorText}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseErrorPopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStylesComponent />
    <Main />
  </StrictMode>
);
