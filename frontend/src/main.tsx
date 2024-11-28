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
import RequestFailedPopUp from './components/Dialogs/errors/RequestFailedPopUp.tsx';

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

  const router = createBrowserRouter(
    [
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
      <RequestFailedPopUp errorText={errorText} onClose={handleCloseErrorPopup} open={isErrorPopupOpen}/>
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStylesComponent />
    <Main />
  </StrictMode>
);
