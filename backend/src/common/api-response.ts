export const success = <T>(data: T, message = 'Operation successful') => ({ success: true, message, data });
export const failure = (message: string, errors: unknown[] = []) => ({ success: false, message, errors });
