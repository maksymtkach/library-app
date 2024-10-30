export class Validation {
  static isValidEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  }

  static isValidYear(year: number): boolean {
    return year > 0 && year <= new Date().getFullYear();
  }
}
