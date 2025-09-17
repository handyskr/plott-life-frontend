interface ImportMetaEnv {
  readonly API_URL: string;
  readonly PUBLIC_APP_URL: string;
  readonly PUBLIC_IMAGE_URL: string;
  readonly PUBLIC_GA_ID: string;
  readonly PUBLIC_GTM_ID: string;
  readonly PUBLIC_NAVER_MAP_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface SessionData {
    accessToken?: string | null;
    refreshToken?: string | null;
  }
  interface Locals {
    isLoggedIn: boolean;
    user?: User | null;
  }
}

type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';

interface User {
  id: number;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  status: EntityStatus;
}
