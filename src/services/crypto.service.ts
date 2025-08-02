// src/services/crypto.service.ts

class EncryptionService {
  private key: CryptoKey | null = null;
  private salt: Uint8Array | null = null;

  async deriveKey(password: string): Promise<void> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    this.salt = salt;
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    this.key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256", // <<< THE FIX IS HERE
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    console.log("Crypto key derived successfully.");
  }

  async encrypt(data: string): Promise<{ iv: Uint8Array, encryptedData: ArrayBuffer } | null> {
    if (!this.key) {
      console.error("Encryption key not derived.");
      return null;
    }
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      this.key,
      encodedData
    );

    return { iv, encryptedData };
  }

  async decrypt(encrypted: { iv: Uint8Array, encryptedData: ArrayBuffer }): Promise<string | null> {
    if (!this.key) {
      console.error("Decryption key not derived.");
      return null;
    }
    const { iv, encryptedData } = encrypted;
    
    try {
        const decryptedData = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            this.key,
            encryptedData
        );
        
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    } catch (e) {
        console.error("Decryption failed:", e);
        return null;
    }
  }
}

export const cryptoService = new EncryptionService();