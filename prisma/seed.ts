import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Upsert all Famalii apps so this script is safe to run multiple times
  const apps = [
    {
      slug: 'famalii-core',
      name: 'Famalii Core',
      description: 'The central hub for your Famalii workspace. Manage your profile, apps, and settings.',
      launchUrl: 'https://famalii-core.vercel.app',
      isActive: true,
    },
    {
      slug: 'famalii-invest',
      name: 'Famalii Invest',
      description: 'Track your investment portfolio, analyze performance, and explore new opportunities.',
      launchUrl: 'https://famaliiinvest.vercel.app',
    },
    {
      slug: 'famalii-markets',
      name: 'Famalii Markets',
      description: 'Real-time market data, watchlists, and financial news in one place.',
      launchUrl: 'https://famalii-core.vercel.app/apps',
      isActive: false, // not yet deployed
    },
    {
      slug: 'famalii-legal',
      name: 'Famalii Legal',
      description: 'Document management, contract templates, and legal resources for your family.',
      launchUrl: 'https://famalii-core.vercel.app/apps',
      isActive: false, // not yet deployed
    },
  ]

  await prisma.$transaction(
    apps.map((app) =>
      prisma.app.upsert({
        where: { slug: app.slug },
        create: app,
        update: { name: app.name, description: app.description, launchUrl: app.launchUrl, isActive: app.isActive ?? true },
      })
    )
  )
  console.log(`✓ Upserted ${apps.length} apps`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
