# Vercel Frontend

The frontend app lives in `frontend/`.

Required Vercel settings if the Vercel Root Directory is the repository root:

- Framework Preset: `TanStack Start`
- Build Command: `npm run build`
- Output Directory: `.vercel/output`
- Environment Variable: `VITE_CHATBOT_API_URL=https://demo-repo-for-git.onrender.com`

The root `vercel.json` stays at the repository root because Vercel reads it from there when the project root is the repository root.

Alternative Vercel setup:

- Root Directory: `frontend`
- Framework Preset: `TanStack Start`
- Build Command: `npm run build`
- Output Directory: `.vercel/output`

Do not leave Root Directory set to the old `Hollow Fall` folder name.
