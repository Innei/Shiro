// Copy from https://github.com/okikio/sharedworker/blob/31830ea0f1f4b1d1cf1444aee7fb1ffd832f63e3/src/index.ts, which is licensed under the MIT license.

// Adapted from https://github.com/okikio/bundle/blob/main/src/ts/util/WebWorker.ts, which is licensed under the MIT license.
// If the above file is removed or modified, you can access the original state in the following GitHub Gist: https://gist.github.com/okikio/6809cfc0cdbf1df4c0573addaaf7e259

/**
 * A polyfill class for `SharedWorker`, it accepts a URL/string as well as any other options the spec. allows for `SharedWorker`. It supports all the same methods and properties as the original, except it adds compatibility methods and properties for older browsers that don't support `SharedWorker`, so, it can switch to normal `Workers` instead.
 */
export class SharedWorkerPolyfill
  implements SharedWorker, EventTarget, AbstractWorker
{
  /**
   * The actual worker that is used, depending on browser support it can be either a `SharedWorker` or a normal `Worker`.
   */
  public ActualWorker: SharedWorker | Worker
  constructor(url: string | URL, opts?: WorkerOptions) {
    if ('SharedWorker' in window) {
      this.ActualWorker = new SharedWorker(url, opts)
    } else {
      this.ActualWorker = new Worker(url, opts)
    }
  }

  /**
   * An EventListener called when MessageEvent of type message is fired on the port—that is, when the port receives a message.
   */
  public get onmessage() {
    if ('SharedWorker' in window) {
      return (this.ActualWorker as SharedWorker)?.port.onmessage
    } else {
      return (this.ActualWorker as Worker)
        .onmessage as unknown as MessagePort['onmessage']
    }
  }

  public set onmessage(value: MessagePort['onmessage'] | Worker['onmessage']) {
    if ('SharedWorker' in window) {
      ;(this.ActualWorker as SharedWorker).port.onmessage =
        value as MessagePort['onmessage']
    } else {
      ;(this.ActualWorker as Worker).onmessage = value as Worker['onmessage']
    }
  }

  /**
   * An EventListener called when a MessageEvent of type MessageError is fired—that is, when it receives a message that cannot be deserialized.
   */
  public get onmessageerror() {
    if ('SharedWorker' in window) {
      return (this.ActualWorker as SharedWorker)?.port.onmessageerror
    } else {
      return (this.ActualWorker as Worker).onmessageerror
    }
  }

  public set onmessageerror(
    value: MessagePort['onmessageerror'] | Worker['onmessageerror'],
  ) {
    if ('SharedWorker' in window) {
      ;(this.ActualWorker as SharedWorker).port.onmessageerror =
        value as MessagePort['onmessageerror']
    } else {
      ;(this.ActualWorker as Worker).onmessageerror =
        value as Worker['onmessageerror']
    }
  }

  /**
   * Starts the sending of messages queued on the port (only needed when using EventTarget.addEventListener; it is implied when using MessagePort.onmessage.)
   */
  public start() {
    if ('SharedWorker' in window) {
      return (this.ActualWorker as SharedWorker)?.port.start()
    }
  }

  /**
   * Clones message and transmits it to worker's global environment. transfer can be passed as a list of objects that are to be transferred rather than cloned.
   */
  public postMessage(
    message: any,
    transfer?: Transferable[] | StructuredSerializeOptions,
  ) {
    if ('SharedWorker' in window) {
      return (this.ActualWorker as SharedWorker)?.port.postMessage(
        message,
        transfer as Transferable[],
      )
    } else {
      return (this.ActualWorker as Worker).postMessage(
        message,
        transfer as Transferable[],
      )
    }
  }

  /**
   * Immediately terminates the worker. This does not let worker finish its operations; it is halted at once. ServiceWorker instances do not support this method.
   */
  public terminate() {
    if ('SharedWorker' in window) {
      return (this.ActualWorker as SharedWorker)?.port.close()
    } else {
      return (this.ActualWorker as Worker).terminate()
    }
  }

  /**
   * Disconnects the port, so it is no longer active.
   */
  public close() {
    return this.terminate()
  }

  /**
   * Returns a MessagePort object used to communicate with and control the shared worker.
   */
  public get port() {
    return (
      'SharedWorker' in window
        ? (this.ActualWorker as SharedWorker).port
        : this.ActualWorker
    ) as MessagePort
  }

  /**
   * Is an EventListener that is called whenever an ErrorEvent of type error event occurs.
   */
  public get onerror() {
    return this.ActualWorker.onerror
  }
  public set onerror(
    value: ((this: AbstractWorker, ev: ErrorEvent) => any) | null,
  ) {
    this.ActualWorker.onerror = value
  }

  /**
   * Registers an event handler of a specific event type on the EventTarget
   */
  public addEventListener<K extends keyof WorkerEventMap>(
    type: K,
    listener: (this: Worker, ev: WorkerEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void
  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void
  public addEventListener<K extends keyof MessagePortEventMap>(
    type: K,
    listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void
  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void {
    if ('SharedWorker' in window && type !== 'error') {
      return (this.ActualWorker as SharedWorker)?.port.addEventListener(
        type,
        listener,
        options,
      )
    } else {
      return this.ActualWorker.addEventListener(type, listener, options)
    }
  }

  /**
   * Removes an event listener from the EventTarget.
   */
  public removeEventListener<K extends keyof WorkerEventMap>(
    type: K,
    listener: (this: Worker, ev: WorkerEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void
  public removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void
  public removeEventListener<K extends keyof MessagePortEventMap>(
    type: K,
    listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void
  public removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void {
    if ('SharedWorker' in window && type !== 'error') {
      return (this.ActualWorker as SharedWorker)?.port.removeEventListener(
        type,
        listener,
        options,
      )
    } else {
      return this.ActualWorker.removeEventListener(type, listener, options)
    }
  }

  /**
   * Dispatches an event to this EventTarget.
   */
  public dispatchEvent(event: Event) {
    return this.ActualWorker.dispatchEvent(event)
  }
}

export default SharedWorkerPolyfill
