export function highlightOpacityAnimation(time) {
  return Math.max(.2, (Math.cos(time / 180) + 1) / 2)
}