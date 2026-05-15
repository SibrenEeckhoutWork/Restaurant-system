const KEY = 'sa_access_token';

export const adminTokenService = {
  get: (): string | null => sessionStorage.getItem(KEY),
  set: (token: string): void => sessionStorage.setItem(KEY, token),
  remove: (): void => sessionStorage.removeItem(KEY),
};
