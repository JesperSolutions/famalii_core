import { SignUpButton } from '@clerk/nextjs'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] px-6 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
        Welcome to{' '}
        <span className="text-indigo-600">Famalii</span>
      </h1>
      <p className="text-xl text-gray-500 max-w-xl mb-10">
        One identity. One workspace. Access all your Famalii apps - Invest, Markets, Legal, and more - from a single account.
      </p>
      <SignUpButton>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg text-base">
          Get started - it&apos;s free
        </button>
      </SignUpButton>
    </div>
  )
}
