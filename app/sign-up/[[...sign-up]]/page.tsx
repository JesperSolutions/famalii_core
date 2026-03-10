import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-f-orange flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-black text-base">F</span>
            </div>
            <span className="text-xl font-black text-f-text">Famalii</span>
          </div>
          <h1 className="text-2xl font-black text-f-text mb-1">Create your account</h1>
          <p className="text-f-muted text-sm">One account. Every Famalii app.</p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
