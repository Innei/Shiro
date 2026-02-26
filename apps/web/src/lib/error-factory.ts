export class PreRenderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PreRenderError'
  }
}
