/// <reference types="vite/client" />

declare global {
  interface Window {
    /** Bootstrap's UMD global; only set if the bundle is loaded via a `<script>` tag (it isn't today). */
    bootstrap?: typeof import('bootstrap')
  }
}

export {}
