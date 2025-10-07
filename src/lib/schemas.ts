// Zod schemas for runtime validation
import { z } from 'zod';

export const PhotoSchema = z.object({
  dataUrl: z.string().startsWith('data:image'),
  timestamp: z.number().positive(),
  index: z.number().min(0).max(3),
});

export const PhotoStripSchema = z.object({
  photos: z.array(PhotoSchema).length(4),
  stripUrl: z.string().startsWith('data:image'),
  createdAt: z.date(),
});

export const CameraConstraintsSchema = z.object({
  video: z.object({
    width: z.object({ ideal: z.number() }),
    height: z.object({ ideal: z.number() }),
    facingMode: z.enum(['user', 'environment']),
  }),
  audio: z.boolean(),
});

// Runtime validators
export const validatePhoto = (data: unknown) => PhotoSchema.safeParse(data);
export const validatePhotoStrip = (data: unknown) =>
  PhotoStripSchema.safeParse(data);

