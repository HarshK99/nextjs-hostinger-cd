import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export async function initProject(): Promise<void> {
  console.log('Initializing Next.js project for static export and deployment...');

  // 1. Check and configure next.config.js
  const nextConfigPath = 'next.config.js';
  let nextConfigContent = '';

  if (existsSync(nextConfigPath)) {
    console.log('next.config.js already exists. Checking configuration...');
    const existingContent = await readFile(nextConfigPath, 'utf-8');
    if (!existingContent.includes("output: 'export'")) {
      console.log('Adding static export configuration to existing next.config.js...');
      // Append or modify - for simplicity, we'll overwrite with a basic config
      nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
`;
      await writeFile(nextConfigPath, nextConfigContent);
    } else {
      console.log('Static export already configured.');
    }
  } else {
    console.log('Creating next.config.js with static export configuration...');
    nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
`;
    await writeFile(nextConfigPath, nextConfigContent);
  }

  // 2. Create .env.example for FTP credentials
  const envExamplePath = '.env.example';
  if (!existsSync(envExamplePath)) {
    console.log('Creating .env.example for FTP credentials...');
    const envContent = `# FTP Credentials for Hostinger Deployment
# Copy this file to .env.local and fill in your actual values
FTP_HOST=your-ftp-host.com
FTP_USER=your-ftp-username
FTP_PASS=your-ftp-password
`;
    await writeFile(envExamplePath, envContent);
  } else {
    console.log('.env.example already exists.');
  }

  // 3. Create GitHub Actions workflow
  const workflowsDir = '.github/workflows';
  const deployYmlPath = join(workflowsDir, 'deploy.yml');

  // Ensure .github/workflows directory exists
  if (!existsSync(workflowsDir)) {
    await mkdir(workflowsDir, { recursive: true });
  }

  if (!existsSync(deployYmlPath)) {
    console.log('Creating GitHub Actions workflow for automated deployment...');
    const workflowContent = `name: Deploy to Hostinger

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build Next.js
        run: npm run build
        
      - name: Export to static
        run: npx nextjs-hostinger-deploy export
        
      - name: Deploy to Hostinger
        run: npx nextjs-hostinger-deploy deploy -h \${{ secrets.FTP_HOST }} -u \${{ secrets.FTP_USER }} -p \${{ secrets.FTP_PASS }}
`;
    await writeFile(deployYmlPath, workflowContent);
  } else {
    console.log('GitHub Actions workflow already exists.');
  }

  console.log('\nNext steps:');
  console.log('1. Copy .env.example to .env.local and fill in your FTP credentials.');
  console.log('   To get FTP credentials from Hostinger:');
  console.log('   - Log in to hostinger.com > Hosting dashboard > Files > FTP Accounts.');
  console.log('   - Create an FTP account if needed (directory: /public_html).');
  console.log('   - Copy FTP Host (e.g., ftp.yourdomain.com), Username, and Password.');
  console.log('2. In your GitHub repo, go to Settings > Secrets and variables > Actions and add:');
  console.log('   - FTP_HOST: Your FTP host');
  console.log('   - FTP_USER: Your FTP username');
  console.log('   - FTP_PASS: Your FTP password');
  console.log('3. Commit and push the changes to master to trigger deployment.');
}