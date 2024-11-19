type Url = (...args: any) => string; // eslint-disable-line @typescript-eslint/no-explicit-any

export const urls = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  authTest: () => '/auth-test',
} satisfies Record<string, Url>;
