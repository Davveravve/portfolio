// src/setupMocks.js
// This file would only be used in development
// In a real implementation, you'd have a backend API handling these requests

// This is a simple way to mock API responses during development
// You would replace this with actual API calls in production
if (process.env.NODE_ENV === 'development') {
    const { createServer } = require('msw/node');
    const { rest } = require('msw');
    
    const server = createServer([
      // Mock API endpoint for project types
      rest.get('/api/project-types', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(['Games', 'Architecture', 'Websites', 'Svenska'])
        );
      }),
      
      // You could add more mock endpoints here
    ]);
    
    server.listen();
  }