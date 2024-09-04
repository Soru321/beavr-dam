import { readFile as fsReadFile } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { promisify } from 'util';

const readFile = promisify(fsReadFile);

export const GET = async (
  req: NextRequest,
  { params: { path } }: { params: { path: string } },
) => {
  path = decodeURIComponent(path);
  const fullPath = join(process.env.PUBLIC_STORAGE, path);

  try {
    const data = await readFile(fullPath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error) {
    return new NextResponse("File not found", { status: 404 });
  }
};
