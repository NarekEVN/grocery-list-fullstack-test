import { z } from 'zod'

const AppConfigSchema = z.object({
  api: z.object({
    apiPort: z.coerce.number(),
  }),
  jwt: z.object({
    secret: z.string(),
    expiresIn: z.string(),
    refreshSecret: z.string(),
    refreshExpiresIn: z.string(),
  }),
})

export type AppConfigType = z.infer<typeof AppConfigSchema>

export default async (): Promise<AppConfigType> => {
  const configObject: AppConfigType = {
    api: {
      apiPort: Number(process.env.PORT) || 3000,
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
  }

  const result = await AppConfigSchema.parseAsync(configObject)

  return result
}
