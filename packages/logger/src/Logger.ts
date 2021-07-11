import Level from "./enums/Level.js";
import ConsoleTransport from "./ConsoleTransport.js";
import type Transport from "./types/Transport.js";
import type Formatter from "./types/Formatter.js";

export interface LoggerOptions{
  level?: Level;
  transports?: Transport[];
  formatter?: Formatter;
}

const enum Priority {
  Error,
  Warn,
  Info,
  Verbose,
  Debug,
  Silly,
}

export const defaults = [
  new ConsoleTransport(),
];

class Logger {
  private readonly priority: Priority;
  private readonly level: Level;
  private readonly transports: Transport[];

  public constructor({level = Level.Info, transports = defaults}: LoggerOptions = {}) {
    this.level = level;
    this.transports = transports;

    this.priority = this.getPriority();
  }

  public error(message: string, meta?: object): void {
    this.log(Level.Error, message, meta);
  }

  public warn(message: string, meta?: object): void {
    if (this.priority >= Priority.Warn) {
      this.log(Level.Warn, message, meta);
    }
  }

  public info(message: string, meta?: object): void {
    if (this.priority >= Priority.Info) {
      this.log(Level.Info, message, meta);
    }
  }

  public verbose(message: string, meta?: object): void {
    if (this.priority >= Priority.Verbose) {
      this.log(Level.Verbose, message, meta);
    }
  }

  public debug(message: string, meta?: object): void {
    if (this.priority >= Priority.Debug) {
      this.log(Level.Debug, message, meta);
    }
  }

  public silly(message: string, meta?: object): void {
    if (this.priority >= Priority.Silly) {
      this.log(Level.Silly, message, meta);
    }
  }

  /**
   * Assign numeric value to level
   */
  private getPriority(): Priority {
    switch (this.level) {
      case Level.Error:   return Priority.Error;
      case Level.Warn:    return Priority.Warn;
      case Level.Info:    return Priority.Info;
      case Level.Verbose: return Priority.Verbose;
      case Level.Debug:   return Priority.Debug;
      case Level.Silly:   return Priority.Silly;
    }
  }

  private log(level: Level, message: string, meta?: object): void {
    for (const transport of this.transports) {
      const time = new Date().toJSON();

      transport.send({
        level,
        time,
        message,
        ...meta,
      });
    }
  }
}

export default Logger;
