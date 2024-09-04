import { TRPCError } from '@trpc/server';
import { mkdir, rename } from 'fs/promises';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { join } from 'path';

import { INTERNAL_SERVER_ERROR } from '@/data/error-messages';
import { DbTmpFilesSelect } from '@/db/schemas/tmp-files';

export const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: +process.env.EMAIL_SERVER_PORT,
  // secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendEmail = async (options: Mail.Options) => {
  await transporter.sendMail(options);
};

interface MoveFilesProps {
  tmpFiles: DbTmpFilesSelect[];
  targetStorage: string;
  targetPath: string;
}

export async function moveFiles({
  tmpFiles,
  targetStorage,
  targetPath,
}: MoveFilesProps) {
  try {
    const images = await Promise.all(
      tmpFiles.map(async (file) => {
        const newPath = `${targetPath}/${file.path}`;

        await mkdir(join(targetStorage, targetPath), { recursive: true });

        await rename(
          join(process.env.TMP_STORAGE, file.path),
          join(targetStorage, newPath),
        );
        return { ...file, path: "/" + newPath };
      }),
    );

    return images;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: INTERNAL_SERVER_ERROR,
    });
  }
}
