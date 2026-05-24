# Mandala Workspace v1 — Launch Ready

This package includes the same-day launch-critical fixes.

## Applied
- Dependency versions pinned for stable Vercel deployment.
- Hardcoded Google Sheets workbook URL removed from `data/mandala.ts`.
- `.env.example` retained.
- Google Apps Script sync remains optional and non-blocking.

## Deploy
Upload this folder to GitHub, then import the GitHub repository into Vercel.

## Vercel Environment Variables
Set:

```env
GOOGLE_APPS_SCRIPT_SYNC_URL=
NEXT_PUBLIC_APP_URL=https://workspace.mandalacreative.com
```

Leave `GOOGLE_APPS_SCRIPT_SYNC_URL` blank for first launch unless Apps Script is already deployed and verified.
