/* eslint-disable-next-line */
type Url = (...args: any) => string;

export const urls = {
  home: () => '/',
  help: () => '/help',

  login: () => '/auth/login',
  register: () => `/auth/register`,
  resetPassword: () => '/auth/reset-password',
  authCallback: () => '/auth/callback',
  signUp: () => `/auth/sign-up`,

  account: () => '/account',
  billing: () => '/billing',
} satisfies Record<string, Url>;
