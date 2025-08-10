

import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("avatar") as File;
    
    if(!file) {
        return NextResponse.json({ error: "No file uploader" }, { status: 400 });
    }

    //папка с авами
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if(!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }


    //уникальное имя файла
    const fileName = `${Date.now()}${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    //сохраняем файл
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${fileName}`});
}