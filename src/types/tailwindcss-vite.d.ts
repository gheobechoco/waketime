// src/types/tailwindcss-vite.d.ts
import type { Plugin } from 'vite';
declare module '@tailwindcss/vite' {
  const plugin: () => Plugin;
  export default plugin;
}
