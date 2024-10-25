// src/Main.tsx
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import AuthGuard from './guards/AuthGuard.tsx';
import PageNotFound from './pages/errors/PageNotFound.tsx';
import SignInCard from './pages/SignIn/SignInPage.tsx';
import { GlobalStyles } from '@mui/material';

let isAuthenticated = true //TODO: Implement authentication logic

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
      html: {
        margin: 0,
        padding: '1em',
        width: '100%',
        height: '100%',
      },
      body: {
        margin: 0,        
        padding: '1em',
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
      },
      '*': {
        boxSizing: 'border-box',
      },
    }}
  />
);

const router = createBrowserRouter([{
  path: '/',
  element: (
    <AuthGuard isAuthenticated={isAuthenticated}>
      <Title title="Home Page">
        <HomePage />
      </Title>
    </AuthGuard>
  ),
  errorElement:
    <PageNotFound />
},
{
  path: '/signin',
  element:
    <Title title='Sign In'>
      <SignInCard />
    </Title>
}, {
  path: '/signup',
  element:
    <Title title='Sign Up'>
      <SignupPage />
    </Title>
}]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStylesComponent/>
    <RouterProvider router={router} />
  </StrictMode>
);
