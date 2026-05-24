import { NextResponse } from "next/server";
import { createProjectWorkspace } from "@/lib/project-engine";

export async function POST(req: Request) {
  try {
    const input = await req.json();
    const project = createProjectWorkspace(input);
    return NextResponse.json({ ok: true, project });
  } catch {
    return NextResponse.json({ ok: false, error: "Project creation failed." }, { status: 400 });
  }
}
