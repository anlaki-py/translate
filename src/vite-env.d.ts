/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_GATEWAY_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
