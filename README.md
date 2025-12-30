# nextjs-hostinger-deploy

[![npm version](https://badge.fury.io/js/nextjs-hostinger-deploy.svg)](https://badge.fury.io/js/nextjs-hostinger-deploy)

A CLI tool to export a Next.js project to static files and deploy them to Hostinger shared hosting via FTP.

**Short command**: Use `nhd` instead of `nextjs-hostinger-deploy` (e.g., `npx nhd init`).

## Installation

```bash
npm install -g nextjs-hostinger-deploy
```

Or for local development:

```bash
git clone <this-repo>
cd nextjs-hostinger-deploy
npm install
npm run build
npm link
```

## Usage

### Prerequisites

- Your Next.js project must be configured for static export (using pages router).
- Run `npm run build` in your Next.js project before exporting.
- Obtain FTP credentials from your Hostinger control panel (see below).

### Getting FTP Credentials from Hostinger

1. Log in to your Hostinger account at [hostinger.com](https://www.hostinger.com).
2. Go to your **Hosting** dashboard.
3. Select your hosting plan/domain.
4. In the control panel, navigate to **Files** > **FTP Accounts**.
5. If no FTP account exists:
   - Click **Create FTP Account**.
   - Enter a username (e.g., your domain name or a custom one).
   - Set a password (or use the generated one).
   - Set the directory to `/public_html` (or your desired root).
   - Click **Create**.
6. Copy the following details:
   - **FTP Host**: Usually `ftp.yourdomain.com` (shown in the FTP Accounts list).
   - **FTP Username**: The username you created (e.g., `yourdomain@yourdomain.com`).
   - **FTP Password**: The password you set.
7. Use these in your `.env.local` file or GitHub Secrets as `FTP_HOST`, `FTP_USER`, `FTP_PASS`.

### Commands

#### Initialize Project for Deployment

```bash
nextjs-hostinger-deploy init
# or
nhd init
```

This command:
- Configures `next.config.js` for static export if not already set.
- Creates `.env.example` with FTP credential placeholders.
- Generates `.github/workflows/deploy.yml` for automated deployment on push to master.

After running `init`, follow the on-screen instructions to set up credentials and GitHub Secrets.

#### Export Next.js to static files

```bash
nextjs-hostinger-deploy export
# or
nhd export
```

This runs `npx next export` in the current directory.

#### Deploy to Hostinger via FTP

```bash
nextjs-hostinger-deploy deploy -h <ftp-host> -u <username> -p <password> [-d <local-dir>] [-r <remote-dir>]
# or
nhd deploy -h <ftp-host> -u <username> -p <password> [-d <local-dir>] [-r <remote-dir>]
```

- `-h, --host`: FTP server host (e.g., ftp.yourdomain.com)
- `-u, --user`: FTP username
- `-p, --password`: FTP password
- `-d, --dir`: Local directory to upload (default: 'out')
- `-r, --remote`: Remote directory on server (default: '/public_html')

#### Full export and deploy

```bash
nextjs-hostinger-deploy full -h <ftp-host> -u <username> -p <password> [-d <local-dir>] [-r <remote-dir>]
# or
nhd full -h <ftp-host> -u <username> -p <password> [-d <local-dir>] [-r <remote-dir>]
```

Combines export and deploy in one command.

## Configuration

For security, consider using environment variables or a config file for FTP credentials instead of command-line arguments.

## Development

```bash
npm run dev  # Run with ts-node
npm run build  # Compile to JavaScript
npm start  # Run compiled version
```

## Publishing to npm

To make this package available on npm for others to install:

### Testing Locally First
Before publishing, test the package locally to ensure it works:

1. In this project directory, link it globally:
   ```bash
   npm link
   ```
2. Create a test Next.js project in another directory:
   ```bash
   npx create-next-app test-project
   cd test-project
   ```
3. Link the local package:
   ```bash
   npm link nextjs-hostinger-deploy
   ```
4. Test the commands:
   ```bash
   nhd init
   nhd export  # After building: npm run build
   ```
5. If issues, fix and rebuild (`npm run build`), then unlink and relink.

### Publishing to npm
1. Ensure you have an npm account: Sign up at [npmjs.com](https://www.npmjs.com) if you don't have one.
2. Log in to npm via CLI:
   ```bash
   npm login
   ```
3. Update `package.json` if needed:
   - Ensure `name` is unique (checked: `nextjs-hostinger-deploy` is available).
   - Set `version` to a new version (e.g., increment from current, like `1.0.1`).
   - Add a `repository` field: `"repository": "https://github.com/yourusername/nextjs-hostinger-deploy"`
4. Build the project:
   ```bash
   npm run build
   ```
5. Test publish (dry run):
   ```bash
   npm publish --dry-run
   ```
   - This simulates publishing without actually uploading.
6. Publish for real:
   ```bash
   npm publish
   ```
   - For a beta release: `npm version prerelease` (e.g., `1.0.1-beta.0`), then `npm publish --tag beta`.
   - Users can install beta with `npm install nextjs-hostinger-deploy@beta`.

After publishing, users can install with `npm install -g nextjs-hostinger-deploy` or `npm install --save-dev nextjs-hostinger-deploy`.