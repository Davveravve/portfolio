const { execSync } = require('child_process');

try {
  execSync('npx react-scripts build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}