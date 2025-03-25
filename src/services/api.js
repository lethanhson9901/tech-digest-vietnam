// API service for fetching reports
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://tech-digest-vietnam.vercel.app';

export const fetchReports = async ({ skip = 0, limit = 10, search = '', dateFrom = '', dateTo = '' }) => {
  const params = new URLSearchParams({
    skip,
    limit,
    ...(search && { search }),
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo })
  });

  const response = await fetch(`${API_BASE_URL}/reports?${params}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

export const fetchLatestReport = async () => {
  const response = await fetch(`${API_BASE_URL}/reports/latest`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

export const fetchReportById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/reports/${id}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};
