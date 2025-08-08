import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-indigo-600 text-9xl font-bold">404</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary">Page not found</h1>
        <p className="mt-6 text-base leading-7 text-secondary">Sorry, we couldn't find the page you're looking for.</p>
        <div className="mt-10">
          <Link 
            to="/" 
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
