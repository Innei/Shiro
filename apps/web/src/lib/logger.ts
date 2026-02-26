export const logger = {
  log: (...args: any[]) => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(
      `%c 白 %c`,
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #39C5BB;',
      ...args.reduce((acc, cur) => {
        acc.push('', cur)
        return acc
      }, []),
    )
  },
}
