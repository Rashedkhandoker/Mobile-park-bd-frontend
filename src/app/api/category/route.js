import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const filePath = join(process.cwd(), "src/app/api/category/category.json");

function readData() {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function writeData(data) {
  writeFileSync(filePath, JSON.stringify(data, null, 4));
}

export async function GET() {
  return NextResponse.json(readData());
}

export async function POST(request) {
  const body = await request.json();
  const store = readData();
  const newItem = {
    ...body,
    id: Math.max(0, ...store.data.map(c => c.id)) + 1,
    slug: body.name?.toLowerCase().replace(/\s+/g, "-"),
    status: Number(body.status ?? 1),
    products_count: 0,
    blogs_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category_image: null,
    category_icon: null,
    category_meta_image: null,
  };
  store.data.push(newItem);
  writeData(store);
  return NextResponse.json({ data: newItem }, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  const store = readData();
  const idx = store.data.findIndex(c => c.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  store.data[idx] = {
    ...store.data[idx],
    ...body,
    status: Number(body.status),
    updated_at: new Date().toISOString(),
  };
  writeData(store);
  return NextResponse.json({ data: store.data[idx] });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const store = readData();
  store.data = store.data.filter(c => c.id !== id);
  writeData(store);
  return NextResponse.json({ success: true });
}
