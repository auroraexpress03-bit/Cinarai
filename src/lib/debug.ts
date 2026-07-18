/* eslint-disable no-console */
export function debug(...args: unknown[]) {
  try {
    if (process.env.NODE_ENV === 'development') {
      // use console.debug so production lint won't warn for console.log elsewhere
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      console.debug(...(args as unknown[]));
    }
  } catch {
    // swallow
  }
}

export default debug;
