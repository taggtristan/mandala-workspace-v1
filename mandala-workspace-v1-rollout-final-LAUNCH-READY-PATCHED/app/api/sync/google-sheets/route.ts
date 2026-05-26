import { NextResponse } from "next/server";

const FALLBACK_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyjB9IS7iPaujhO2dwD-Hu_bXTPf8S10sAaX84Wu-edNiJqFRhP97EQE2n05w_z4WcKaA/exec";

export async function GET() {
  const endpoint = (process.env.GOOGLE_APPS_SCRIPT_SYNC_URL || FALLBACK_APPS_SCRIPT_URL).trim();

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      headers: {
        Accept: "application/json,text/plain,*/*"
      }
    });

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json(
        {
          connected: res.ok && Boolean(data.connected ?? true),
          status: res.status,
          data,
          syncedAt: data.syncedAt || new Date().toISOString()
        },
        { status: res.ok ? 200 : 502 }
      );
    } catch {
      return NextResponse.json(
        {
          connected: false,
          stage: "parse",
          status: res.status,
          contentType: res.headers.get("content-type"),
          responsePreview: text.slice(0, 500)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        stage: "fetch",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
