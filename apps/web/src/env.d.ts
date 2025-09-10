interface ImportMetaEnv {
  readonly PUBLIC_GA_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface SessionData {
    user: {
      id: string;
    };
  }
}
