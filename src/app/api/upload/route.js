import { NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const dir = join(process.cwd(), "public/assets/images/products");

    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, filename), buffer);

    const url = `/assets/images/products/${filename}`;
    return NextResponse.json({ url, original_url: url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
