import { z } from 'zod';

import { MAX_FILE_SIZE } from '@/data';

export const fileSchema = z.object({
  file: z.any().refine((file) => file?.size <= MAX_FILE_SIZE, {
    message: "File is too large",
    params: {
      instruction: "Maximum file size is 2 MB",
    },
  }),
});
// .refine(
//   (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
//   "Only .jpg, .jpeg, .png and .webp formats are supported.",
// ),
