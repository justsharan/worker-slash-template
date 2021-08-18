import nacl from 'tweetnacl';

function decodeHex(str: string): number[] {
  const matches = str.match(/.{1,2}/g);
  if (matches == null) {
    throw new Error('Value is not a valid hex string');
  }
  return matches.map(byte => Number.parseInt(byte, 16));
}

export default function verify(
  body: string,
  signature: string,
  timestamp: string,
  publicKey: string,
): boolean {
  try {
    const decodedSig = new Uint8Array(decodeHex(signature));
    const decodedPubKey = new Uint8Array(decodeHex(publicKey));
    const message = new TextEncoder().encode(timestamp + body);

    return nacl.sign.detached.verify(message, decodedSig, decodedPubKey);
  } catch(err) {
    return false;
  }
}
