declare module 'gifsicle-wasm-browser' {
  interface InputFile {
    file: string | File | Blob | ArrayBuffer
    name: string
  }

  interface RunOptions {
    input: InputFile[]
    command: string[]
  }

  interface Gifsicle {
    run(options: RunOptions): Promise<File[]>
  }

  const gifsicle: Gifsicle
  export default gifsicle
}
