import brand from './brand.json'
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");

    let data = brand.data;

    if (ids) {
        const idList = ids.split(",").map(Number);
        const idSet = new Set(idList);
        const filtered = data.filter((b) => idSet.has(b.id));
        const indexMap = Object.fromEntries(idList.map((id, i) => [id, i]));
        data = filtered.sort((a, b) => indexMap[a.id] - indexMap[b.id]);
    }

    return NextResponse.json({ ...brand, data });
}
