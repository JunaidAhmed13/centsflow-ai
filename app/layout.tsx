import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CentsFlow AI — Personal Finance Dashboard',
  description: 'Track, analyze, and optimize your personal finances with AI-powered insights.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} antialiased bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100`}
        >
          {/*
           * Runs synchronously before hydration via Next.js Script API.
           * Reads localStorage and sets the `dark` class on <html> before
           * first paint, preventing a flash of unstyled light content.
           * Using next/script with beforeInteractive instead of a raw
           * <script> in <head> avoids corrupting Next.js's chunk manifest.
           */}
          <Script
            id="theme-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `try{var t=localStorage.getItem('centsflow-theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}`,
            }}
          />
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
