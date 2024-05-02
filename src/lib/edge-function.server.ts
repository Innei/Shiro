export const getQuery = (req: Request) => {
  const url = new URL(req.url)
  const searchParams = url.searchParams
  const obj = {} as Record<string, any>

  for (const [key, value] of searchParams.entries()) {
    obj[key] = value
  }

  return obj
}

export class NextServerResponse {
  #status = 200
  #headers = new Headers()

  status(status: number) {
    this.#status = status
    return this
  }

  json(data: any) {
    const nextData = JSON.stringify(data)

    this.#headers.set('Content-Type', 'application/json')

    return new Response(nextData, this.makeResponseOptions())
  }

  send(data: any) {
    // if (data instanceof Stream) {
    //   return
    // }

    if (typeof data === 'object' || typeof data === 'undefined') {
      return this.json(data)
    }

    return new Response(data, this.makeResponseOptions())
  }

  text(text: string) {
    return new Response(text, this.makeResponseOptions())
  }

  end() {
    return new Response('', this.makeResponseOptions())
  }

  headers(headers: Record<string, string>) {
    for (const [key, value] of Object.entries(headers)) {
      this.#headers.set(key, value)
    }

    return this
  }

  private makeResponseOptions() {
    return {
      status: this.#status,
      headers: this.#headers,
    }
  }
}
