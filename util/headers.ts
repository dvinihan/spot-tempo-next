export const buildHeaders = (accessToken: string) => {
  return { Authorization: `Bearer ${accessToken}` };
};
