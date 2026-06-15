import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          ¢
        </div>
        <span className="text-2xl font-bold text-white">CentsFlow<span className="text-indigo-400">AI</span></span>
      </div>

      {/* Hero */}
      <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
        Your finances, on autopilot
      </h1>
      <p className="text-slate-400 text-center max-w-md mb-8">
        Text your expenses on WhatsApp. AI parses them. See everything here.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {['WhatsApp Input', 'Groq AI Parsing', 'Supabase Storage', 'Live Dashboard'].map(f => (
          <span key={f} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-sm">
            {f}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex gap-4">
        <Link href="/sign-in" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition">
          Sign In
        </Link>
        <Link href="/sign-up" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-medium transition">
          Sign Up
        </Link>
      </div>
    </main>
  )
}