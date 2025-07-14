// ⚠️ UTILIDAD DE PRUEBA: debounce
// Sirve para limitar la ejecución rápida de una función (muy útil en inputs o scrolls).

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
