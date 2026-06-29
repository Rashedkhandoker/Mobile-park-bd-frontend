import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const filePath = join(process.cwd(), "src/app/api/brand/brand.json");

function readData() {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function writeData(data) {
  writeFileSync(filePath, JSON.stringify(data, null, 4));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");
  const store = readData();
  let data = store.data;

  if (ids) {
    const idList = ids.split(",").map(Number);
    const idSet = new Set(idList);
    const filtered = data.filter((b) => idSet.has(b.id));
    const indexMap = Object.fromEntries(idList.map((id, i) => [id, i]));
    data = filtered.sort((a, b) => indexMap[a.id] - indexMap[b.id]);
  }

  return NextResponse.json({ ...store, data });
}

export async function POST(request) {
  const body = await request.json();
  const store = readData();
  const newItem = {
    ...body,
    id: Math.max(0, ...store.data.map(b => b.id)) + 1,
    slug: body.name?.toLowerCase().replace(/\s+/g, "-"),
    status: Number(body.status ?? 1),
    brand_image: null,
    brand_meta_image: null,
    brand_banner: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };
  store.data.push(newItem);
  writeData(store);
  return NextResponse.json({ data: newItem }, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  const store = readData();
  const idx = store.data.findIndex(b => b.id === body.id);
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
  store.data = store.data.filter(b => b.id !== id);
  writeData(store);
  return NextResponse.json({ success: true });
}
