# Vercel Deployment Checklist

## Local verification
1. Install Node.js 20 LTS.
2. Run `npm install`.
3. Run `npm run build`.
4. Run `npm run start` and open the local URL.

## GitHub
Commit and push the complete project folder to the existing repository.

## Vercel
1. Open Vercel and choose **Add New → Project**.
2. Import the existing GitHub repository.
3. Keep the detected framework as **Next.js**.
4. Keep the build command as `npm run build`.
5. Use Node.js 20.
6. Click **Deploy**.

No environment variables are needed by the current demo.

## Current architecture
- Next.js App Router
- Client-side React state
- Browser `localStorage` persistence
- Excel report generation in the browser
- No API/server/database dependency

## Production upgrade later
For multiple restaurant devices sharing the same live orders, replace `localStorage` with a shared database/API and add real authentication. The existing UI can be retained while the data layer is replaced.
