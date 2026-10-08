import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const EMAIL_KEY = 'shopper_email';
const PASSWORD_HASH_KEY = 'shopper_password_hash';
const PASSWORD_SALT_KEY = 'shopper_password_salt';

export async function createLocalUser(
  email: string,
  password: string,
): Promise<void> {
  const salt = Crypto.randomUUID();

  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );

  await SecureStore.setItemAsync(EMAIL_KEY, email);
  await SecureStore.setItemAsync(PASSWORD_SALT_KEY, salt);
  await SecureStore.setItemAsync(PASSWORD_HASH_KEY, hash);
}

export async function getLocalEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(EMAIL_KEY);
}

export async function hasLocalUser(): Promise<boolean> {
  const email = await SecureStore.getItemAsync(EMAIL_KEY);
  const hash = await SecureStore.getItemAsync(PASSWORD_HASH_KEY);

  return Boolean(email && hash);
}

export async function validatePassword(
  password: string,
): Promise<boolean> {
  const salt = await SecureStore.getItemAsync(PASSWORD_SALT_KEY);
  const savedHash = await SecureStore.getItemAsync(PASSWORD_HASH_KEY);

  if (!salt || !savedHash) {
    return false;
  }

  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );

  return hash === savedHash;
}

export async function changePassword(
  newPassword: string,
): Promise<void> {
  const salt = Crypto.randomUUID();

  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${newPassword}`,
  );

  await SecureStore.setItemAsync(PASSWORD_SALT_KEY, salt);
  await SecureStore.setItemAsync(PASSWORD_HASH_KEY, hash);
}