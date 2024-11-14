// src/Main.tsx
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import AuthGuard from './guards/AuthGuard.tsx';
import PageNotFound from './components/Dialogs/errors/PageNotFound.tsx';
import SignInCard from './pages/SignIn/SignInPage.tsx';
import { GlobalStyles } from '@mui/material';
import { isAuthenticated } from './utils/authHelper.ts';
import RequestFailedPopUp from './components/Dialogs/errors/RequestFailedPopUp.tsx';
import { initializeErrorHandling } from './services/api/interceptors.ts';

interface TitleProps {
  title: string;
  children: React.ReactNode;
}

const Title = ({ title, children }: TitleProps) => {
  useEffect(() => {
    document.title = title + " | PowerPal";
  }, [title]);

  return <>{children}</>;
};

const GlobalStylesComponent = () => (
  <GlobalStyles
    styles={{
      html: { margin: 0, padding: 0, width: '100%', height: '100%' },
      body: { margin: 0, padding: 0, width: '100%', height: '100%', overflowX: 'hidden' },
      '*': { boxSizing: 'border-box' },
    }}
  />
);

const Main = () => {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  const [errorText, setErrorText] = useState('');
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);

  // Funzione per chiudere il popup
  const handleCloseErrorPopup = () => {
    setIsErrorPopupOpen(false);
    setErrorText('');
  };

  useEffect(() => {
    initializeErrorHandling(() => setIsErrorPopupOpen(true), setErrorText);

    setAuthStatus(isAuthenticated());
  }, []);

  if (authStatus === null) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AuthGuard isAuthenticated={isAuthenticated()}>
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
      <RequestFailedPopUp
        open={isErrorPopupOpen}
        onClose={handleCloseErrorPopup}
        errorText={errorText}
      />
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStylesComponent />
    <Main />
  </StrictMode>
);
