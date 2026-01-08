import { motion } from 'framer-motion'
import { Github, Twitter } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-lavender-900/20 via-transparent to-pink-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lavender-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-aqua-500/10 rounded-full blur-3xl" />
      </div>

      <header className="border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/vp.svg" alt="Giftro" className="w-8 h-8" />
            <h1 className="text-xl font-bold">
              <span className="bg-gradient-to-r from-lavender-500 via-pink-500 to-aqua-500 bg-clip-text text-transparent">Giftro</span>
              <span className="text-white/50 font-normal text-base ml-2">GIF Intro Generator</span>
            </h1>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="hidden sm:inline text-xs font-medium text-lavender-400 px-3 py-1 rounded-full bg-lavender-500/15 border border-lavender-500/30">
              v1.0
            </span>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 relative">
        {children}
      </main>

      <footer className="border-t border-white/10 py-6 backdrop-blur-sm bg-black/20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            Create animated typing GIFs for your GitHub README
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Niraj-Kamdar/giftro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
            <a
              href="https://x.com/0xkniraj"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              <Twitter className="w-4 h-4" />
              <span className="hidden sm:inline">@0xkniraj</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
