import { debounce } from "debounce"
import { Ref, onMounted, onUnmounted, watch } from "vue"
import { OuijaBoard } from "./OuijaBoard"

interface UseTrustCanvasOptions {
    canvas: Ref<HTMLCanvasElement | undefined>,
    onInteractionEnd?: () => void,
}

export function useOuijaBoard({ canvas, onInteractionEnd }: UseTrustCanvasOptions) {
    const trust = new OuijaBoard()

    const handleResize = debounce(() => trust.resizeToClientWidth(), 300)

    onMounted(() => {
        trust.setCanvas(canvas.value)
        if (onInteractionEnd) trust.on('brush-end', onInteractionEnd)
        window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
        if (onInteractionEnd) trust.off('brush-end', onInteractionEnd)
        window.removeEventListener('resize', handleResize)
    })

    watch(canvas, canvas => trust.setCanvas(canvas))

    return {
        clear() {
            trust.clear()
        }
    }
}