import { ref, watch } from "vue"

type Theme = 'light' | 'dark'

function createThemeStore() {
    const preferred: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    let theme = ref<Theme>(localStorage.theme ?? preferred ?? 'dark')
    watch(theme, theme => {
        localStorage.theme = theme
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    })

    function toggle() {
        if (theme.value === 'dark') {
            theme.value = 'light'
        } else {
            theme.value = 'dark'
        }
    }

    return {
        get theme() { return theme.value },
        set theme(v: Theme) { theme.value = v },
        toggle
    }
}

export default createThemeStore()