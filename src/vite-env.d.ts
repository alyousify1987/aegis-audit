// src/vite-env.d.ts

/// <reference types="vite/client" />

// This tells TypeScript that the Window object can have a showDirectoryPicker function.
interface Window {
  showDirectoryPicker(): Promise<any>;
}