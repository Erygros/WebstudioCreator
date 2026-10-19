import { z } from 'zod';
import { configurationSchema } from './pricing';
const plain = z.string().trim().min(2).max(120);
export const platforms = ['Twitch', 'Kick', 'YouTube', 'TikTok', 'Instagram'] as const;
export const bookingSchema = z
  .object({
    locale: z.enum(['de', 'en']),
    configuration: configurationSchema,
    name: plain,
    email: z.email().max(254),
    phone: z.string().trim().max(40),
    creator: plain,
    platforms: z.array(z.enum(platforms)).min(1).max(5),
    links: z
      .string()
      .trim()
      .max(2000)
      .refine(
        (v) =>
          v
            .split(/\s+/)
            .filter(Boolean)
            .every((url) => {
              try {
                return ['http:', 'https:'].includes(new URL(url).protocol);
              } catch {
                return false;
              }
            }),
        'Use full https:// links',
      ),
    description: z.string().trim().min(20).max(8000),
    wishes: z.string().trim().max(3000),
    serviceBrief: z.string().trim().min(5).max(3000),
    deadline: z
      .string()
      .max(10)
      .refine(
        (v) =>
          !v ||
          (/^\d{4}-\d{2}-\d{2}$/.test(v) &&
            !Number.isNaN(Date.parse(v)) &&
            v >= new Date().toISOString().slice(0, 10)),
        'Choose a future date',
      ),
    payment: z.enum(['discuss', 'bank', 'invoice', 'crypto']),
    consent: z.literal(true),
    website: z.string().max(0),
  })
  .strict();
export type Booking = z.infer<typeof bookingSchema>;
export const contactSchema = z
  .object({
    locale: z.enum(['de', 'en']),
    name: plain,
    email: z.email().max(254),
    subject: plain,
    message: z.string().trim().min(20).max(8000),
    consent: z.literal(true),
    website: z.string().max(0),
  })
  .strict();
export type Contact = z.infer<typeof contactSchema>;
export const MAX_FILES = 3;
export const MAX_TOTAL_BYTES = 3 * 1024 * 1024;
