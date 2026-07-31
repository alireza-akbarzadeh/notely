import { z } from "zod";

const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
    BETTER_AUTH_URL: z.string().url().optional(),
    BETTER_AUTH_API_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    EMAIL_PROVIDER: z.enum(["console", "resend"]).default("console"),
    RESEND_API_KEY: z.string().min(1).optional(),
    EMAIL_FROM: z.string().email().optional(),
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    APPLE_CLIENT_ID: z.string().min(1).optional(),
    APPLE_TEAM_ID: z.string().min(1).optional(),
    APPLE_KEY_ID: z.string().min(1).optional(),
    APPLE_PRIVATE_KEY: z.string().min(1).optional(),
    APPLE_APP_BUNDLE_IDENTIFIER: z.string().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.EMAIL_PROVIDER === "resend") {
      if (!value.RESEND_API_KEY) {
        ctx.addIssue({
          code: "custom",
          path: ["RESEND_API_KEY"],
          message: "RESEND_API_KEY is required when EMAIL_PROVIDER=resend",
        });
      }
      if (!value.EMAIL_FROM) {
        ctx.addIssue({
          code: "custom",
          path: ["EMAIL_FROM"],
          message: "EMAIL_FROM is required when EMAIL_PROVIDER=resend",
        });
      }
    }

    const googlePartial =
      Boolean(value.GOOGLE_CLIENT_ID) !== Boolean(value.GOOGLE_CLIENT_SECRET);
    if (googlePartial) {
      ctx.addIssue({
        code: "custom",
        path: ["GOOGLE_CLIENT_ID"],
        message: "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must both be set",
      });
    }

    const appleAny = Boolean(
      value.APPLE_CLIENT_ID ||
        value.APPLE_TEAM_ID ||
        value.APPLE_KEY_ID ||
        value.APPLE_PRIVATE_KEY,
    );
    const appleAll = Boolean(
      value.APPLE_CLIENT_ID &&
        value.APPLE_TEAM_ID &&
        value.APPLE_KEY_ID &&
        value.APPLE_PRIVATE_KEY,
    );
    if (appleAny && !appleAll) {
      ctx.addIssue({
        code: "custom",
        path: ["APPLE_CLIENT_ID"],
        message:
          "Apple auth requires APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY",
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

function emptyToUndefined(value: string | undefined) {
  if (value === undefined || value.trim() === "") return undefined;
  return value;
}

function loadEnv(): Env {
  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: emptyToUndefined(process.env.BETTER_AUTH_URL),
    BETTER_AUTH_API_KEY: emptyToUndefined(process.env.BETTER_AUTH_API_KEY),
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    RESEND_API_KEY: emptyToUndefined(process.env.RESEND_API_KEY),
    EMAIL_FROM: emptyToUndefined(process.env.EMAIL_FROM),
    GOOGLE_CLIENT_ID: emptyToUndefined(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: emptyToUndefined(process.env.GOOGLE_CLIENT_SECRET),
    APPLE_CLIENT_ID: emptyToUndefined(process.env.APPLE_CLIENT_ID),
    APPLE_TEAM_ID: emptyToUndefined(process.env.APPLE_TEAM_ID),
    APPLE_KEY_ID: emptyToUndefined(process.env.APPLE_KEY_ID),
    APPLE_PRIVATE_KEY: emptyToUndefined(process.env.APPLE_PRIVATE_KEY),
    APPLE_APP_BUNDLE_IDENTIFIER: emptyToUndefined(
      process.env.APPLE_APP_BUNDLE_IDENTIFIER,
    ),
  });

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${message}`);
  }

  return parsed.data;
}

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = loadEnv();
  }
  return cachedEnv;
}
