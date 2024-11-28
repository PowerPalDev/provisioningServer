import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ height: '100vh', padding: '1rem' }}
    >
      <h1 style={{ fontSize: '6rem', fontWeight: 'bold' }}>404</h1>
      <h5 className="mb-2">Oops! Page Not Found</h5>
      <p className="mb-4">
        The page you're looking for doesn't exist. It might have been removed, or you may have typed the wrong URL.
      </p>
      <button className="btn btn-primary" onClick={handleGoHome}>
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
