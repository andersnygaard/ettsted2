export interface AuthUser {
  identityProvider?: string;
  userId?: string;
  userDetails?: string;
  givenName?: string;
  familyName?: string;
  claims?: Array<{ typ: string; val: string }>;
}

export async function fetchAuthUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/.auth/me');
    const data = await res.json();
    const authData = data?.[0];

    if (!authData?.user_id) return null;

    const getClaim = (type: string) =>
      authData.user_claims?.find((c: { typ: string; val: string }) =>
        c.typ.endsWith(type)
      )?.val;

    return {
      identityProvider: authData.provider_name,
      userId: authData.user_id,
      userDetails: authData.user_id,
      givenName: getClaim('givenname'),
      familyName: getClaim('surname'),
      claims: authData.user_claims
    };
  } catch {
    return null;
  }
}
