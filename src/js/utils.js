export const zeroArray = (length) => Array.from({ length }, () => 0)
export const zeroMatrix = (length) => Array.from({ length }, () => zeroArray(length))

export const randomArray = (length) => Array.from({ length }, () => Math.round(Math.random()))
export const randomMatrix = (length) => Array.from({ length }, () => randomArray(length))

export function reduceMatrix(matrix) {
	let minX = matrix.length - 1
	let minY = matrix[0].length
	let maxX = 0
	let maxY = 0

	for (let x = 0; x < matrix.length; x++)
		for (let y = 0; y < matrix[0].length; y++) {
			if (!matrix[x][y]) {
				continue
			}
			minX = Math.min(minX, x)
			minY = Math.min(minY, y)
			maxX = Math.max(maxX, x)
			maxY = Math.max(maxY, y)
		}
	const result = []
	for (let x = minX; x <= maxX; x++)
		for (let y = minY; y <= maxY; y++)
			(result[x - minX] || (result[x - minX] = []))[y - minY] = matrix[x][y]
	return result
}
