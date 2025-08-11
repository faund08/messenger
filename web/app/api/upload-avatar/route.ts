
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';

export async function POST(req: NextRequest) { 
    
    const formData = await req.formData();
    const file: File | null = formData.get('avatar') as File;

    if (!file) {
        return NextResponse.json({ error: 'File not found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: imageUrl });
}