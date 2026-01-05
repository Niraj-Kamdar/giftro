import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layout } from './components/Layout'
import { InputForm } from './components/InputForm'
import { AnimationPreview } from './components/AnimationPreview'
import { GifControls } from './components/GifControls'
import { getDefaultConfig } from './lib/animationEngine'
import { type AnimationConfig } from './lib/types'

function App() {
  const [config, setConfig] = useState<AnimationConfig>(getDefaultConfig)

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
              <InputForm config={config} onChange={setConfig} />
            </div>
          </motion.div>

          {/* Right: Preview Section */}
          <motion.div
            className="space-y-6 lg:sticky lg:top-24"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 text-white/90">Preview</h2>
              <AnimationPreview config={config} />
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 text-white/90">Export</h2>
              <GifControls config={config} />
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default App
