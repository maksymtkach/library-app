export class Storage {
  static save(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static load<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
