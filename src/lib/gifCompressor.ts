import gifsicle from 'gifsicle-wasm-browser'
import type { CompressionSettings } from './types'

export interface CompressionResult {
  blob: Blob
  originalSize: number
  compressedSize: number
}

export function buildCommand(settings: CompressionSettings): string {
  const parts: string[] = []

  // Optimization level
  parts.push(`-O${settings.optimizationLevel}`)

  // Lossy compression (only if > 0)
  if (settings.lossy > 0) {
    parts.push(`--lossy=${settings.lossy}`)
  }

  // Color reduction (only if specified)
  if (settings.colors !== null && settings.colors >= 2 && settings.colors <= 256) {
    parts.push(`--colors`)
    parts.push(`${settings.colors}`)
  }

  // Input and output
  parts.push('input.gif')
  parts.push('-o')
  parts.push('/out/compressed.gif')

  return parts.join(' ')
}

export async function compressGif(
  inputBlob: Blob,
  settings: CompressionSettings
): Promise<CompressionResult> {
  const originalSize = inputBlob.size

  // Build gifsicle command
  const command = buildCommand(settings)

  // Run gifsicle
  const outputFiles = await gifsicle.run({
    input: [
      {
        file: inputBlob,
        name: 'input.gif',
      },
    ],
    command: [command],
  })

  if (!outputFiles || outputFiles.length === 0) {
    throw new Error('Compression failed: no output file generated')
  }

  const compressedBlob = new Blob([outputFiles[0]], { type: 'image/gif' })
  const compressedSize = compressedBlob.size

  return {
    blob: compressedBlob,
    originalSize,
    compressedSize,
  }
}

export function getDefaultCompressionSettings(): CompressionSettings {
  return {
    enabled: true,
    lossy: 50,
    optimizationLevel: 2,
    colors: null,
  }
}
