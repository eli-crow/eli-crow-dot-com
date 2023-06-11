import { debounce } from "debounce";
import { onMounted, onUnmounted, watch } from "vue";
import { OuijaBoard } from "./OuijaBoard";

interface UseOuijaBoradOptions {
  canvas: Ref<HTMLCanvasElement | null>;
  onInteractionEnd?: () => void;
}

interface UseOuijaBoardHook {
  clear: () => void;
}

export function useOuijaBoard({
  canvas,
  onInteractionEnd,
}: UseOuijaBoradOptions): UseOuijaBoardHook {
  if (process.server) {
    return {
      clear() {},
    };
  }

  const board = new OuijaBoard();

  const handleResize = debounce(() => board.resizeToClientWidth(), 300);

  onMounted(() => {
    board.setCanvas(canvas.value);
    if (onInteractionEnd) board.on("brush-end", onInteractionEnd);
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    board.destroy();
    window.removeEventListener("resize", handleResize);
  });

  watch(canvas, (canvas) => board.setCanvas(canvas));

  return {
    clear() {
      board.clear();
    },
  };
}
