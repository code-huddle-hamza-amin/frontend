export const BASE_URL = 'http://localhost:8000';

export async function googleAuth({ idToken, serverAuthCode, user, scopes }: {
  idToken: string;
  serverAuthCode: string;
  user: any;
  scopes: string[];
}) {
  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, serverAuthCode, user, scopes })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

// Add more API functions as needed 