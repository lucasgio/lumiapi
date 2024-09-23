/**
 * The LoggerHelper class provides static methods for logging different levels of messages
 * such as info, error, warning, debug, and trace. Each method logs the message to the console
 * with a specific prefix indicating the log level.
 */
export class LoggerHelper {
  /**
   * Logs an informational message to the console.
   * @param message - The message to log.
   */
  static logInfo(message: string) {
    console.log(`[INFO]  ${message}`);
  }

  /**
   * Logs an error message to the console.
   * @param message - The message to log.
   */
  static logError(message: string) {
    console.error(`[ERROR]  ${message}`);
  }

  /**
   * Logs a warning message to the console.
   * @param message - The message to log.
   */
  static logWarn(message: string) {
    console.warn(`[WARN]  ${message}`);
  }

  /**
   * Logs a debug message to the console.
   * @param message - The message to log.
   */
  static logDebug(message: string) {
    console.debug(`[DEBUG]  ${message}`);
  }

  /**
   * Logs a trace message to the console along with the current stack trace.
   * @param message - The message to log.
   */
  static logTrace(message: string) {
    console.trace(`[TRACE]  ${message}`);
  }
}
