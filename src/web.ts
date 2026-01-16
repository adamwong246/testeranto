class WebTestHoist {
  constructor() {
  }

  async start(): Promise<void> {
    console.log(`[WebTestHoist] start()`)
    // await super.start();
  }

  async stop(): Promise<void> {
    console.log(`[WebTestHoist] stop()`)
    // await super.stop();
  }
}

new WebTestHoist().start();