import { NextResponse } from "next/server";

const FALLBACK_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyjB9IS7iPaujhO2dwD-Hu_bXTPf8S10sAaX84Wu-edNiJqFRhP97EQE2n05w_z4WcKaA/exec";

type SyncAttempt = {
  endpoint: string;
  fallbackUsed: boolean;
};

async function fetchWorkbook({ endpoint, fallbackUsed }: SyncAttempt) {
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
    return {
      ok: res.ok,
      payload: {
        connected: res.ok && Boolean(data.connected ?? true),
        status: res.status,
        data,
        syncedAt: data.syncedAt || new Date().toISOString(),
        fallbackUsed
      }
    };
  } catch {
    return {
      ok: false,
      payload: {
        connected: false,
        stage: "parse",
        status: res.status,
        contentType: res.headers.get("content-type"),
        responsePreview: text.slice(0, 500),
        fallbackUsed
      }
    };
  }
}

export async function GET() {
  const configuredEndpoint = process.env.GOOGLE_APPS_SCRIPT_SYNC_URL?.trim();
  const endpoints = [
    configuredEndpoint,
    configuredEndpoint === FALLBACK_APPS_SCRIPT_URL ? undefined : FALLBACK_APPS_SCRIPT_URL
  ].filter((endpoint): endpoint is string => Boolean(endpoint));

  let lastPayload: Record<string, unknown> | null = null;

  for (const endpoint of endpoints) {
    try {
      const result = await fetchWorkbook({
        endpoint,
        fallbackUsed: endpoint === FALLBACK_APPS_SCRIPT_URL && configuredEndpoint !== FALLBACK_APPS_SCRIPT_URL
      });

      if (result.ok) {
        return NextResponse.json(result.payload);
      }

      lastPayload = result.payload;
    } catch (error) {
      lastPayload = {
        connected: false,
        stage: "fetch",
        error: error instanceof Error ? error.message : String(error),
        fallbackUsed: endpoint === FALLBACK_APPS_SCRIPT_URL
      };
    }
  }

  return NextResponse.json(
    lastPayload ?? {
      connected: false,
      stage: "config",
      error: "No workbook sync endpoint is configured."
    },
    { status: 500 }
  );
}
