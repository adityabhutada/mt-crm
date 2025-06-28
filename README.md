# Mass Tort CRM

This project is a simple CRM built with React and Vite. It uses Tailwind CSS and stores data in the browser's local storage.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the development server**
   ```bash
   npm run dev
   ```
3. **Create a production build**
   ```bash
   npm run build
   ```

## Deployment on Hostinger

1. Run `npm run build` to generate the `dist/` folder.
2. Upload the contents of `dist/` to your `public_html` directory using the file manager or FTP.
3. Add an `.htaccess` file to enable client‑side routing:
   ```
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```
4. Use Hostinger's control panel to create a MySQL database if you need server-side data storage.

## Linting

Run ESLint to check code quality:
```bash
npm run lint
```
