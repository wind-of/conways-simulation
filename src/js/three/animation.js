export function hintOpacityAnimation(time) {
	return Math.max(0.2, (Math.cos(time / 180) + 1) / 2)
}
