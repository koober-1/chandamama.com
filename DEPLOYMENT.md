# Production deployment

This project supports two production modes. Choose one mode and keep the same
environment values during every build because all `NEXT_PUBLIC_*` variables are
embedded in the browser bundle at build time.

## First Git import

Run these commands from the project directory. Replace the remote URL and
branch name if your provider uses different values.

```powershell
git init
git branch -M main
git add .
git status
git commit -m "Initial Next.js storefront"
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

Before committing, confirm that `.env`, `node_modules`, `.next`, and `out` do
not appear under "Changes to be committed". The source files, `.env.example`,
`.htaccess`, `package.json`, and `package-lock.json` should appear.

For later releases:

```powershell
git add .
git status
git commit -m "Describe the production change"
git push origin main
```

## Prepare the repository

1. Install Node.js 20 LTS or newer and npm.
2. Copy `.env.example` to `.env` and enter the production values. Never commit
   `.env`.
3. Install the exact locked dependencies:

   ```powershell
   npm ci
   ```

4. Test the production build:

   ```powershell
   npm run build
   ```

## Option A: static Apache/cPanel deployment

Use this mode when the domain serves files from the generated `out` directory.

1. Set this value in `.env`:

   ```dotenv
   NEXT_PUBLIC_SEO=false
   ```

2. Build:

   ```powershell
   npm ci
   npm run build
   ```

3. Back up the current production document root.
4. Upload the **contents** of `out`, including its generated `.htaccess`, into
   the document root (commonly `public_html`). Do not upload `out` as an extra
   nested directory unless the web server document root points to it.
5. Purge any CDN/server cache and verify the homepage, product pages, dynamic
   product URLs, checkout, and a hard refresh.

The `out` directory should not be committed. Production or CI must generate it
from the tagged source revision and production environment values.

## Option B: standalone Node.js deployment

Use this mode only when the server runs Node.js behind Nginx or Apache.

1. Set this value in `.env`:

   ```dotenv
   NEXT_PUBLIC_SEO=true
   ```

2. Build and start/reload with PM2:

   ```powershell
   npm ci
   npm run build
   pm2 start ecosystem.config.cjs
   ```

   For later releases:

   ```powershell
   npm ci
   npm run build
   pm2 reload egrocer-web
   ```

3. Configure the reverse proxy to forward the domain to `127.0.0.1:8001`.
4. Save PM2 after the first successful start:

   ```powershell
   pm2 save
   ```

## Safe release sequence

1. Pull or check out the intended Git tag/commit into a new release directory.
2. Create its production `.env` from the server's secret/configuration store.
3. Run `npm ci` and `npm run build`.
4. If the build succeeds, switch the web root/symlink or reload PM2.
5. Smoke-test the site, then retain the previous release for quick rollback.

Never run `npm audit fix --force` as part of deployment; it can alter locked
dependencies and introduce breaking changes. Review dependency upgrades in a
separate change.
