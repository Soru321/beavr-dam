import crypto from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import Path, { join } from 'path';

import { INTERNAL_SERVER_ERROR } from '@/data/error-messages';
import { db } from '@/db';
import { tmpFiles } from '@/db/schemas/tmp-files';
import { getServerAuthSession } from '@/server/auth';

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return new NextResponse("The file is required", { status: 422 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());

    const tmpStorage = process.env.TMP_STORAGE;
    mkdir(tmpStorage, { recursive: true });

    const path =
      crypto.randomBytes(5).toString("hex") +
      Date.now() +
      Path.parse(file.name).ext;
    const fullPath = join(tmpStorage, path);
    await writeFile(fullPath, buffer);

    const session = await getServerAuthSession();
    const tmpFile = await db
      .insert(tmpFiles)
      .values({
        userId: session?.user.id,
        mimeType: file.type,
        name: file.name,
        path,
      });

    return NextResponse.json({ id: tmpFile[0].insertId });
  } catch (error) {
    return new NextResponse(INTERNAL_SERVER_ERROR, { status: 500 });
  }
};
