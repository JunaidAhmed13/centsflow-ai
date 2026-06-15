import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center gap-8 px-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-9 w-9 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-xl">
          ¢
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-100">
          CentsFlow<span className="text-indigo-400">AI</span>
        </span>
      </div>
      <SignIn />
    </div>
  )
}
