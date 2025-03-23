// src/components/Archive.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Archive() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        
        // Fetch report list from MongoDB through an API endpoint
        const response = await axios.get('/api/reports');
        
        // Sort reports by date in descending order (newest first)
        const sortedReports = response.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        
        setReports(sortedReports);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="content">
        <div className="loading-message">
          <p>Loading archive data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <article>
        <h1>Tech Digest Archive</h1>
        {reports.length === 0 ? (
          <p>No reports available yet.</p>
        ) : (
          <div className="archive-list">
            {reports.map((report) => (
              <div key={report._id} className="section-container archive-item">
                <h2>
                  <Link to={`/report/${report.filename}`}>
                    Tech Digest - {formatDate(report.date)}
                  </Link>
                </h2>
                {report.summary && (
                  <p className="archive-summary">{report.summary}</p>
                )}
                <div className="archive-meta">
                  <span className="archive-date">{formatDate(report.date)}</span>
                  {report.topicCount && (
                    <span className="archive-topics">
                      {report.topicCount} topics
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

export default Archive;
