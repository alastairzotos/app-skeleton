type Url = (...args: any) => string;

export const urls = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  authTest: () => '/auth-test',
} satisfies Record<string, Url>;
