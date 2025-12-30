import { Client } from 'basic-ftp';

interface DeployOptions {
  host: string;
  user: string;
  password: string;
  dir: string;
  remote: string;
}

export async function deployFtp(options: DeployOptions): Promise<void> {
  const client = new Client();
  client.ftp.verbose = true;

  try {
    console.log(`Connecting to FTP server: ${options.host}`);
    await client.access({
      host: options.host,
      user: options.user,
      password: options.password,
      secure: false, // Hostinger shared hosting may not support FTPS
    });

    console.log('Connected successfully.');

    // Ensure remote directory exists
    await client.ensureDir(options.remote);
    await client.cd(options.remote);

    console.log(`Uploading files from ${options.dir} to ${options.remote}...`);
    await client.uploadFromDir(options.dir);

    console.log('Upload completed.');
  } catch (error) {
    console.error('FTP deployment failed.');
    throw error;
  } finally {
    client.close();
  }
}