import { and, eq, inArray } from "drizzle-orm";
import { Session } from "next-auth";

import { Db } from "@/db";
import { tmpFiles } from "@/db/schemas/tmp-files";

interface GetTmpFilesByIdsProps {
  db: Db;
  session: Session | null;
  ids: number[];
}

export async function getTmpFilesByIds({
  db,
  session,
  ids,
}: GetTmpFilesByIdsProps) {
  if (!ids.length) return [];

  return await db.query.tmpFiles.findMany({
    where: and(
      eq(tmpFiles.userId, session?.user.id ?? -1),
      inArray(tmpFiles.id, ids),
    ),
  });
}
