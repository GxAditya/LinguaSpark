/**
 * Type declarations for browser globals that may be conditionally checked
 * in shared/isomorphic code. These APIs are not available in Node.js runtime
 * but the type declarations prevent TypeScript errors when checking for their existence.
 */

// localStorage is only available in browsers
declare const localStorage: Storage | undefined;

// Blob may not be available in older Node.js versions
declare const Blob: {
  new (blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
  prototype: Blob;
} | undefined;

interface Storage {
  readonly length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
  [name: string]: unknown;
}

interface BlobPropertyBag {
  type?: string;
  endings?: 'transparent' | 'native';
}

type BlobPart = BufferSource | Blob | string;

interface Blob {
  readonly size: number;
  readonly type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  slice(start?: number, end?: number, contentType?: string): Blob;
  stream(): ReadableStream;
  text(): Promise<string>;
}
