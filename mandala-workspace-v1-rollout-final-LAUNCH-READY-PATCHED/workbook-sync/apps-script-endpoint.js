/**
 * Mandala Workspace Google Sheets Sync Endpoint
 * Deploy in Google Apps Script as Web App.
 */
const WORKBOOK_ID = "1iMM-74wmIabcPr55ot56CNOXQSzKCamZZxgD73Y3Rgw";

const TAB_MAP = {
  projectSettings: "Project Settings",
  tasks: "Detailed Production Schedule",
  milestones: "Milestones & Deadlines",
  risks: "Risks & Adjustments",
  procurement: "Procurement Tracker",
  readiness: "Installation Readiness",
  estimate: "Mural + Paint Estimate",
  estimateExclusions: "Estimate Exclusions",
  eventPlanning: "Event Planning",
  eventVendors: "Event Vendors",
  licensing: "Licensing + Permits"
};

function doGet() {
  const ss = SpreadsheetApp.openById(WORKBOOK_ID);
  const payload = {};
  Object.keys(TAB_MAP).forEach(key => {
    payload[key] = getRows(ss, TAB_MAP[key]);
  });
  payload.connected = true;
  payload.workbookId = WORKBOOK_ID;
  payload.workbookName = ss.getName();
  payload.syncedAt = new Date().toISOString();

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost() {
  return doGet();
}

function getRows(ss, tabName) {
  const sheet = ss.getSheetByName(tabName);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(cleanKey);

  return values
    .slice(1)
    .filter(row => row.some(cell => cell !== "" && cell !== null))
    .map(row =>
      headers.reduce((obj, key, index) => {
        obj[key] = normalizeValue(row[index]);
        return obj;
      }, {})
    );
}

function cleanKey(value) {
  return String(value || "")
    .trim()
    .replace(/%/g, "percent")
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, chr => chr.toLowerCase());
}

function normalizeValue(value) {
  if (value instanceof Date) return value.toISOString().split("T")[0];
  return value;
}
