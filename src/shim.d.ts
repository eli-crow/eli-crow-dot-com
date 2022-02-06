declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

interface ImportMetaEnv {
    FIGMA_ACCESS_TOKEN?: string
    VITE_SERVER_URL?: string
}