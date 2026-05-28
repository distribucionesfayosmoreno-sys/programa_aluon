/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JIRA_ENABLED?: 'true' | 'false';
  readonly VITE_APP_ENV_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}
