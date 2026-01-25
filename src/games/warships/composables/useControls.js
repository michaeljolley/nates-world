import { ref, onBeforeUnmount } from 'vue'

const keys = ref({
  w: false,
  s: false,
  a: false,
  d: false,
  space: false,
  escape: false
})

export function useControls() {
  function onKeyDown(e) {
    const key = e.key.toLowerCase()
    if (key === 'w') keys.value.w = true
    if (key === 's') keys.value.s = true
    if (key === 'a') keys.value.a = true
    if (key === 'd') keys.value.d = true
    if (key === ' ') {
      keys.value.space = true
      e.preventDefault()
    }
    if (key === 'escape') keys.value.escape = true
  }

  function onKeyUp(e) {
    const key = e.key.toLowerCase()
    if (key === 'w') keys.value.w = false
    if (key === 's') keys.value.s = false
    if (key === 'a') keys.value.a = false
    if (key === 'd') keys.value.d = false
    if (key === ' ') keys.value.space = false
    if (key === 'escape') keys.value.escape = false
  }

  function init() {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
  }

  function dispose() {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  }

  function resetKeys() {
    keys.value.w = false
    keys.value.s = false
    keys.value.a = false
    keys.value.d = false
    keys.value.space = false
    keys.value.escape = false
  }

  onBeforeUnmount(dispose)

  return {
    keys,
    init,
    dispose,
    resetKeys
  }
}
