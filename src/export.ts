import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function exportNextJs(): Promise<void> {
  console.log('Starting Next.js export...');
  try {
    // Note: This assumes the project is using Next.js pages router.
    // For app router, static export might require different configuration.
    const { stdout, stderr } = await execAsync('npx next export');
    if (stdout) console.log(stdout);
    if (stderr) console.warn(stderr);
  } catch (error) {
    console.error('Next.js export failed. Make sure you are in a Next.js project directory and have run `npm run build` first.');
    throw error;
  }
}