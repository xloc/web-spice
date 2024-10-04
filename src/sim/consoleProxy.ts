

export const console = {
  log: (..._args: any[]) => { },
  error: (...args: any[]) => { window.console.error(args) }
}
