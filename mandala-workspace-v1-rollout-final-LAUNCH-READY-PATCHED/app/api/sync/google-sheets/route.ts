import { NextResponse } from "next/server";

export async function GET() {
 const endpoint = "https://script.google.com/macros/s/AKfycbyjB9IS7iPaujhO2dwD-Hu_bXTPf8S10sAaX84Wu-edNiJqFRhP97EQE2n05w_z4WcKaA/exec";

  if (!endpoint || endpoint === "not-configured") {
    return NextResponse.json({
      connected: false,
      stage: "env",
      error: "GOOGLE_APPS_SCRIPT_SYNC_URL is missing or not-configured",
      hasEndpoint: Boolean(endpoint),
    });
  }

  try {
    const res = await fetch(endpoint.trim(), {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      headers: {
        Accept: "application/json,text/plain,*/*",
      },
    });

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json({
        connected: true,
        status: res.status,
        data,
        syncedAt: new Date().toISOString(),
      });
    } catch {
      return NextResponse.json({
        connected: false,
        stage: "parse",
        status: res.status,
        contentType: res.headers.get("content-type"),
        responsePreview: text.slice(0, 500),
      });
    }
  } catch (error) {
    return NextResponse.json({
      connected: false,
      stage: "fetch",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
