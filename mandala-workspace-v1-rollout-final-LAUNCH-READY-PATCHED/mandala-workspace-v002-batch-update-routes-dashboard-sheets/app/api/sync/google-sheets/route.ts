import { NextResponse } from "next/server";

export async function GET() {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_SYNC_URL;
  if (!endpoint || endpoint === "not-configured") {
    return NextResponse.json({
      connected: false,
      message: "GOOGLE_APPS_SCRIPT_SYNC_URL is not configured.",
      nextStep: "Deploy workbook-sync/apps-script-endpoint.js and set the environment variable."
    });
  }

  try {
    const res = await fetch(endpoint, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json({ connected: true, data, syncedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ connected: false, error: "Workbook sync failed." }, { status: 500 });
  }
}
