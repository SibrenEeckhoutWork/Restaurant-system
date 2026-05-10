const KEY = 'access_token';

export const tokenService = {
  get: (): string | null => sessionStorage.getItem(KEY),
  set: (token: string): void => sessionStorage.setItem(KEY, token),
  remove: (): void => sessionStorage.removeItem(KEY),
};
