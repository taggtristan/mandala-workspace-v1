# Mandala Workspace v004 Live Dashboard Mapping Update

This batch removes dashboard-local demo/fallback state and maps the live Patineta workbook payload into the top Mandala Workspace dashboard.

## Main changes

- Adds `lib/live-workbook-map.ts`
- Updates `modules/dashboard/dashboard.tsx`
- Keeps the polished sidebar/dashboard/workbook/Gantt visual structure
- Uses `/api/sync/google-sheets` as the live workbook source
- Replaces stale labels like Sync pending / Demo / Waiting for sync with live workbook-derived states
- Uses real task, milestone, risk, event, and workbook rows when available

## Expected outcome

After deploy, the dashboard should show Patineta project data in:
- project status card
- Tasks in Progress
- Completed Tasks
- Average Completion
- Risk Items
- Event Workstreams
- Gantt preview
- Agile task panel
- Workbook preview table
