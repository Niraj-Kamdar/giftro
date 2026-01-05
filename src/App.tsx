import { motion } from 'framer-motion'
import { Layout } from './components/Layout'

function App() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Form Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 text-white/90">Configure Your GIF</h2>
              <p className="text-white/50 text-sm">Form coming soon...</p>
            </div>
          </motion.div>

          {/* Right: Preview Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 text-white/90">Preview</h2>
              <div className="aspect-[3/1] bg-black/50 rounded-lg flex items-center justify-center border border-white/10">
                <p className="text-white/30 font-mono text-sm">Animation preview...</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 text-white/90">Export</h2>
              <button className="w-full py-3 px-6 bg-gradient-to-r from-lavender-500 to-pink-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Generate GIF
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default App
