
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// DATABASE_URL is read from process.env (injected by Vercel) or .env locally.
// The datasource url is already declared in prisma/schema.prisma via env("DATABASE_URL").
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
})
