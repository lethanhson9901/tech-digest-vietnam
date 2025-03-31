# Tech Digest Vietnam

A modern React application for browsing technical reports and digests about the Vietnamese tech ecosystem. This application provides an intuitive interface for reading the latest technology trends, news, and insights.

## Features

- **Latest Report View**: Quick access to the most recent tech digest
- **Archive Browser**: Search and filter through past reports
- **Dark Mode Support**: Toggle between light and dark themes for comfortable reading
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Advanced Search**: Find reports by keywords, titles, or content
- **Date Filtering**: Filter reports by date ranges
- **Table of Contents**: Easy navigation within reports
- **Enhanced Reading Experience**: Clean typography and layout for readability

## Project Structure

The application follows a standard React project structure with organized components, pages, hooks, and utilities:

```
src/
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API and external service integrations
├── utils/           # Utility functions
├── App.jsx          # Main application component
└── index.js         # Application entry point
```

## Key Components

- **Header**: Navigation and dark mode toggle
- **MarkdownRenderer**: Renders markdown content with enhanced styling
- **TableOfContents**: Generates navigation from document headings
- **SearchBar**: Advanced search functionality
- **DateRangePicker**: Date range filtering component
- **ListViewReportsList**: Displays reports in a list format
- **Pagination**: Handles pagination for report lists

## Pages

- **HomePage**: Landing page with featured content
- **LatestReportPage**: Displays the most recent tech digest
- **ArchivePage**: Browse and search through all past reports
- **ReportDetailPage**: Detailed view of a specific report
- **NotFoundPage**: 404 error page

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tech-digest-app.git
   cd tech-digest-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. The application will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_BASE_URL=https://tech-digest-vietnam.vercel.app
```

## API Integration

The application integrates with a backend API that provides:
- List of tech digest reports
- Report details
- Latest report
- Search functionality
- Date filtering

## Styling

The project uses:
- Tailwind CSS for utility-based styling
- Custom CSS for specialized components
- Dark mode support with theme persistence

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing library
- Tailwind CSS for the utility-first CSS framework
- date-fns for date formatting
- react-markdown for markdown rendering

---

Built with ❤️ for the Vietnamese tech community