import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Upsert all Famalii apps so this script is safe to run multiple times
  const apps = [
    {
      slug: 'famalii-core',
      name: 'Famalii Core',
      description: 'The central hub for your Famalii workspace. Manage your profile, apps, and settings.',
      launchUrl: 'http://localhost:3000',
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
      launchUrl: 'https://markets.famalii.com',
    },
    {
      slug: 'famalii-legal',
      name: 'Famalii Legal',
      description: 'Document management, contract templates, and legal resources for your family.',
      launchUrl: 'https://legal.famalii.com',
    },
  ]

  for (const app of apps) {
    await prisma.app.upsert({
      where: { slug: app.slug },
      create: app,
      update: { name: app.name, description: app.description, launchUrl: app.launchUrl },
    })
    console.log(`✓ Upserted app: ${app.slug}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
