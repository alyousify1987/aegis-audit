// src/services/encryption.service.ts
// AES-GCM encryption service for client-side data security (RFP/Annex compliant)

export class EncryptionService {
  private key: CryptoKey | null = null;

  // Derive a key from a password using PBKDF2
  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Set the session key (should be called after login)
  setKey(key: CryptoKey) {
    this.key = key;
  }

  // Encrypt data (returns base64 string)
  async encrypt(data: any): Promise<{ iv: string; ciphertext: string }> {
    if (!this.key) throw new Error('Encryption key not set');
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encoded = enc.encode(JSON.stringify(data));
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      encoded
    );
    return {
      iv: btoa(String.fromCharCode(...iv)),
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    };
  }

  // Decrypt data (from base64 string)
  async decrypt({ iv, ciphertext }: { iv: string; ciphertext: string }): Promise<any> {
    if (!this.key) throw new Error('Encryption key not set');
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    const ctBytes = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      this.key,
      ctBytes
    );
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
  }
}

export const encryptionService = new EncryptionService();
