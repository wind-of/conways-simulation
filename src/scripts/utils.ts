import THREE = require("three")
import { FieldMatrix, Position } from "./types"

export const zeroArray = (length: number) => Array.from({ length }, () => 0)
export const zeroMatrix = (length: number) => Array.from({ length }, () => zeroArray(length))

export const randomArray = (length: number) => Array.from({ length }, () => Math.round(Math.random()) as (0 | 1))
export const randomMatrix = (length: number) => Array.from({ length }, () => randomArray(length))

export function reduceMatrix(matrix: FieldMatrix): FieldMatrix {
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

export function doesHintCrossBorders({ matrixSize, rowsCount, columnsCount, startX, startZ }: {
	matrixSize: number
	rowsCount: number
	columnsCount: number
	startX: number
	startZ: number
}): boolean {
	return (
		matrixSize < rowsCount + startX ||
		matrixSize < columnsCount + startZ ||
		startX < 0 ||
		startZ < 0
	)
}

export function reverseCoordinateSigns({ x, y, z }: Position): THREE.Vector3 {
	return new THREE.Vector3(-x, -y, -z)
}

export function matrixToRLEFormat({ string, width, height }: { string: string, width: number, height: number }): string {
	return (
`#N MyField ${(Math.random() * (10**6)) | 0}
#O Unknown Creator ${new Date().toISOString()}
x = ${width}, y = ${height}
${string}`
	)
}
