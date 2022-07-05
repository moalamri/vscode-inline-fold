/**
 * Debouncing passed in functions to avoid multiple triggers.
 * @param {Function} func The function to debounce.
 * @param {number} wait The time to wait in milliseconds.
 * @returns {Function} The debounced function.
 */ 
export function debouncer<T extends Function>(func: T, wait: number = 0) {
  let timeout: NodeJS.Timeout = null;
  const callable = (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
  };
  return <T>(<any>callable);
}