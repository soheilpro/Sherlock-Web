import * as CryptoJS from 'crypto-js';

export function decrypt(data: ArrayBuffer, password: string): ArrayBuffer {
  const key = CryptoJS.enc.Utf8.parse(fixedSizeString(password, 24));
  const iv = CryptoJS.enc.Utf8.parse(fixedSizeString(password, 8));
  const decrypted = CryptoJS.TripleDES.decrypt({ ciphertext: CryptoJS.lib.WordArray.create(data) } as any, key, { 'iv': iv }) ;

  return wordArrayToArrayBuffer(decrypted);
}

export function encrypt(data: ArrayBuffer, password: string): ArrayBuffer {
  const key = CryptoJS.enc.Utf8.parse(fixedSizeString(password, 24));
  const iv = CryptoJS.enc.Utf8.parse(fixedSizeString(password, 8));
  const encrypted = CryptoJS.TripleDES.encrypt(CryptoJS.lib.WordArray.create(data), key, { 'iv': iv });

  return wordArrayToArrayBuffer(encrypted.ciphertext);
}

function fixedSizeString(text: string, length: number): string {
  while (text.length < length)
    text += text;

  if (text.length > length)
    text = text.substring(0, length);

  return text;
}

function wordArrayToArrayBuffer(wordArray: CryptoJS.lib.WordArray): ArrayBuffer {
  const result = new Uint8Array(wordArray.words.length << 2);
  let offset = 0;

  for (const word of wordArray.words) {
    result[offset++] = word >> 24;
    result[offset++] = (word >> 16) & 0xff;
    result[offset++] = (word >> 8) & 0xff;
    result[offset++] = word & 0xff;
  }

  return result;
}
