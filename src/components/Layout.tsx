import { motion } from 'framer-motion'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.h1
            className="text-xl font-bold bg-gradient-to-r from-lavender-500 via-pink-500 to-aqua-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            GIF Intro Generator
          </motion.h1>
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/60 hover:text-white transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            GitHub
          </motion.a>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>

      <footer className="border-t border-white/10 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-white/40">
          Create animated typing GIFs for your README
        </div>
      </footer>
    </div>
  )
}
