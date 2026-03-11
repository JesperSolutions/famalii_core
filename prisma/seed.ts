import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function daysAgo(d: number): Date {
  return new Date(Date.now() - d * 86_400_000)
}

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
      launchUrl: 'https://famalii-legal.vercel.app',
      isActive: true,
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

  // ── App updates (news feed) ───────────────────────────────────────────────
  const updates = [
    // famalii-invest
    {
      appSlug:     'famalii-invest',
      title:       'Live prices now refresh every 60 seconds',
      body:        'Your portfolio and watchlist pages now poll Yahoo Finance every minute so you always see near-real-time prices — no manual refresh needed.',
      category:    'Feature',
      publishedAt: daysAgo(1),
    },
    {
      appSlug:     'famalii-invest',
      title:       'Portfolio allocation view',
      body:        'A new allocation breakdown shows your exposure by asset class (Stocks, ETFs, Crypto) with a visual segment bar and weighted holdings table.',
      category:    'Feature',
      publishedAt: daysAgo(4),
    },
    {
      appSlug:     'famalii-invest',
      title:       'Watchlist expanded to 6 tickers',
      body:        'NVDA, TSLA, META, AMZN, GOOGL and ETH are now available on your personal watchlist. Custom tickers are coming in the next release.',
      category:    'Update',
      publishedAt: daysAgo(8),
    },
    {
      appSlug:     'famalii-invest',
      title:       'Performance improved on dashboard load',
      body:        'Parallel data fetching on the portfolio page reduced median load time by ~40%. Charts and price data now stream in independently.',
      category:    'Fix',
      publishedAt: daysAgo(14),
    },
    // famalii-legal
    {
      appSlug:     'famalii-legal',
      title:       '256-bit encryption on all uploads',
      body:        'All documents uploaded to your vault are now encrypted at rest using AES-256. Existing files have been re-encrypted automatically.',
      category:    'Security',
      publishedAt: daysAgo(2),
    },
    {
      appSlug:     'famalii-legal',
      title:       'Rental Agreement template added',
      body:        'A new residential lease template covering landlord/tenant obligations, rent terms, and termination clauses is available in the template library.',
      category:    'Feature',
      publishedAt: daysAgo(6),
    },
    {
      appSlug:     'famalii-legal',
      title:       'GDPR compliance guide published',
      body:        'A new in-app guide explains how Famalii Legal handles your family\'s personal data, retention periods, and your right to deletion.',
      category:    'Legal',
      publishedAt: daysAgo(11),
    },
    {
      appSlug:     'famalii-legal',
      title:       'Contract expiry reminders',
      body:        'Contracts with an expiry date now appear in your activity feed 30 days before they expire. Email notifications will follow in the next release.',
      category:    'Feature',
      publishedAt: daysAgo(18),
    },
  ]

  for (const u of updates) {
    // Use title + appSlug as a natural unique key so re-seeding is idempotent
    const existing = await prisma.appUpdate.findFirst({
      where: { appSlug: u.appSlug, title: u.title },
    })
    if (!existing) {
      await prisma.appUpdate.create({ data: u })
    }
  }
  console.log(`✓ Seeded ${updates.length} app updates`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
