import React from 'react';
import TestInlineCode from '../components/TestInlineCode';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <TestInlineCode />
      </div>
    </div>
  );
};

export default TestPage;
