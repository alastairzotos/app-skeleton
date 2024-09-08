type Url = (...args: any) => string;

export const urls = {
  home: () => '/',
  login: () => '/auth',
  authTest: () => '/auth-test',
} satisfies Record<string, Url>;
