# Live Sync Dashboard Update

This batch restores the polished Mandala dashboard layout and connects it to the live Google Sheets API.

Updated files:
- `modules/dashboard/dashboard.tsx`
- `app/api/sync/google-sheets/route.ts`
- `workbook-sync/apps-script-endpoint.js`

The API route uses `GOOGLE_APPS_SCRIPT_SYNC_URL` when available and falls back to the current working Apps Script `/exec` URL.
