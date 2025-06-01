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

// JSON Reports API functions
export const fetchJsonReports = async ({ skip = 0, limit = 10, search = '' }) => {
  const params = new URLSearchParams({
    skip,
    limit,
    ...(search && { search })
  });

  const response = await fetch(`${API_BASE_URL}/json-reports?${params}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

export const fetchLatestJsonReport = async () => {
  const response = await fetch(`${API_BASE_URL}/json-reports/latest`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

export const fetchJsonReportById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/json-reports/${id}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

// Combined Analysis API functions
export const fetchCombinedAnalysis = async ({ skip = 0, limit = 10, search = '', dateFrom = '', dateTo = '' }) => {
  const params = new URLSearchParams({
    skip,
    limit,
    ...(search && { search }),
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo })
  });

  const response = await fetch(`${API_BASE_URL}/combined-analysis?${params}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

export const fetchLatestCombinedAnalysis = async () => {
  const response = await fetch(`${API_BASE_URL}/combined-analysis/latest`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

export const fetchCombinedAnalysisById = async (id) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    console.log(`Fetching combined analysis with ID: ${id}`);
    console.log(`API URL: ${API_BASE_URL}/combined-analysis/${id}`);
    
    const response = await fetch(`${API_BASE_URL}/combined-analysis/${id}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response ok: ${response.ok}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - The server is taking too long to respond');
    }
    console.error('Fetch error:', error);
    throw error;
  }
};
