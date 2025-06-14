/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
  // Déclaration pour les modules CSS pour que TypeScript les reconnaisse
  declare module '*.css' {
    const css: { [key: string]: string };
    export default css;
  }
  