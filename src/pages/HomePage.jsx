// src/pages/HomePage.jsx (enhanced version)
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { fetchLatestReport } from '../services/api';

const HomePage = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadLatestReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchLatestReport();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestReport();
    
    // Animation delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!report) {
    return <ErrorMessage message="Latest report not found" />;
  }

  return (
    <div className={`max-w-4xl mx-auto transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Tech Digest Vietnam</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest technology trends, news, and insights from the Vietnamese tech ecosystem.
        </p>
      </div>
      
      {/* Latest Report Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-white">Latest Tech Digest</h1>
            {report.upload_date && (
              <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm mt-2 md:mt-0 inline-block">
                {format(new Date(report.upload_date), 'MMMM d, yyyy')}
              </div>
            )}
          </div>
          <p className="text-indigo-100 mt-2">{report.filename}</p>
        </div>
        
        <div className="p-6 relative">
          {/* Preview of the content with max height */}
          <div className="prose prose-indigo max-w-none max-h-[500px] overflow-hidden relative">
            <MarkdownRenderer content={report.content} />
            {/* Gradient overlay to indicate there's more content */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
          </div>
          
          {/* Read more button */}
          <div className="mt-6 text-center">
            <Link 
              to={`/reports/${report.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Read Full Report
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link to="/archive" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h2 className="ml-4 text-xl font-semibold text-gray-800">Archive</h2>
          </div>
          <p className="text-gray-600">Browse all previous tech digest reports.</p>
        </Link>
        
        <Link to="/latest" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="ml-4 text-xl font-semibold text-gray-800">Latest Report</h2>
          </div>
          <p className="text-gray-600">View our most recent tech insights.</p>
        </Link>
        
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="ml-4 text-xl font-semibold text-gray-800">About Us</h2>
          </div>
          <p className="text-gray-600">Learn more about Tech Digest Vietnam and our mission.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
