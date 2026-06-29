import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const filePath = join(process.cwd(), "src/app/api/order/order.json");

function readData() {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function writeData(data) {
  writeFileSync(filePath, JSON.stringify(data, null, 4));
}

export async function GET(request) {
  return NextResponse.json(readData());
}

export async function PUT(request) {
  const body = await request.json();
  const store = readData();
  const idx = store.data.findIndex(o => o.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  store.data[idx] = { ...store.data[idx], ...body, updated_at: new Date().toISOString() };
  writeData(store);
  return NextResponse.json({ data: store.data[idx] });
}
