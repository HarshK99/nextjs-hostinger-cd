#!/usr/bin/env node

import { Command } from 'commander';
import { exportNextJs } from './export';
import { deployFtp } from './deploy';
import { initProject } from './init';

const program = new Command();

program
  .name('nextjs-hostinger-deploy')
  .description('CLI to export Next.js to static and deploy to Hostinger via FTP')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize Next.js project for static export and create deployment workflow')
  .action(async () => {
    try {
      await initProject();
      console.log('Project initialized successfully. Review the generated files and update credentials.');
    } catch (error) {
      console.error('Initialization failed:', error);
      process.exit(1);
    }
  });

program
  .command('export')
  .description('Export Next.js project to static files')
  .action(async () => {
    try {
      await exportNextJs();
      console.log('Next.js export completed successfully.');
    } catch (error) {
      console.error('Export failed:', error);
      process.exit(1);
    }
  });

program
  .command('deploy')
  .description('Deploy static files to Hostinger via FTP')
  .requiredOption('-h, --host <host>', 'FTP host')
  .requiredOption('-u, --user <user>', 'FTP username')
  .requiredOption('-p, --password <password>', 'FTP password')
  .option('-d, --dir <dir>', 'Local directory to deploy', 'out')
  .option('-r, --remote <remote>', 'Remote directory on server', '/public_html')
  .action(async (options) => {
    try {
      await deployFtp(options);
      console.log('Deployment completed successfully.');
    } catch (error) {
      console.error('Deployment failed:', error);
      process.exit(1);
    }
  });

program
  .command('full')
  .description('Export Next.js and deploy to Hostinger')
  .requiredOption('-h, --host <host>', 'FTP host')
  .requiredOption('-u, --user <user>', 'FTP username')
  .requiredOption('-p, --password <password>', 'FTP password')
  .option('-d, --dir <dir>', 'Local directory to deploy', 'out')
  .option('-r, --remote <remote>', 'Remote directory on server', '/public_html')
  .action(async (options) => {
    try {
      await exportNextJs();
      console.log('Next.js export completed.');
      await deployFtp(options);
      console.log('Deployment completed successfully.');
    } catch (error) {
      console.error('Process failed:', error);
      process.exit(1);
    }
  });

program.parse();