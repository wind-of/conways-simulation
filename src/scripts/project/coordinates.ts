import * as THREE from "three"
import { PositionToString, IndexMirroringFunction, HintNormalizationFunction, IndexConversionFunction, PositionConversionFunction, PositionMirroringFunction, RaycasterObjectPositionNormalizationFunction } from "@/types"

export const positionToString: PositionToString = ({ x, z }) => `x${x};z${z}`

/**
 * Let `n = 50` to be the size of a matrix. 
 * @param max `n`
 * @param d dimension value, a number from the interval `[-24.5; 24.5]`
 * @result a number from the interval `[0, 49]`
 */
export const normilizeIndex: IndexConversionFunction = ({ d, max }) => Math.ceil(max / 2 + Math.round(d) - 1)
/**
 * Let `n = 50` to be the size of a matrix. 
 * @param max `n`
 * @param d dimension value, a number from the interval `[0, 49]`
 * @result a number from the interval `[-24.5; 24.5]`
 */
export const reverseNormilizeIndex: IndexConversionFunction = ({ d, max }) => d - max / 2 + 0.5
/**
 * Let `n = 50` to be the size of a matrix.
 * @param max `n`
 * @param d dimension value, a number from the interval `[0, 49]` 
 * @result if `d` greater than `max`, then the `result = d - max`; else if `d < 0`, then the `result = d + max`; else `result = d` 
 */
export const mirroredIndex: IndexMirroringFunction = ({ d, max }) => {
	const offset = d < 0 
		? max 
		: d >= max 
			? -max 
			: 0
	return d + offset
}

/**
 * @param position an object with `x` and `z` properties
 * @param max the size of the matrix
 * @result a pair of normalized indexes
 */
export const normilizePosition: PositionConversionFunction = ({ position: { x, z }, max }) => ({
	x: normilizeIndex({ d: x, max }),
	z: normilizeIndex({ d: z, max })
})
/**
 * @param position an object with `x` and `z` properties
 * @param max the size of the matrix
 * @result a pair of reverse-normalized indexes
 */
export const reverseNormilizePosition: PositionConversionFunction = ({ position: { x, z }, max }) => ({
	x: reverseNormilizeIndex({ d: x, max }),
	z: reverseNormilizeIndex({ d: z, max })
})
/**
 * @param position an object with `x` and `z` properties
 * @param max the size of the matrix
 * @result a pair of mirrored indexes `x` and `z`
 */
export const mirrorePosition: PositionMirroringFunction = ({ position: { x, z }, max }) => ({
	x: mirroredIndex({ d: x, max }),
	z: mirroredIndex({ d: z, max })
})

/**
 * @param object an intersected cell 
 * @param offsetVector offset from the center of the scene
 * @result a reverse-normalized position
 */
export const raycasterIntersectionPosition: RaycasterObjectPositionNormalizationFunction = ({ object, offsetVector }) => {
	const position = new THREE.Vector3().copy(object.point).floor().addScalar(0.5)
	if (offsetVector) {
		position.add(offsetVector)
	}
	return position
}

/**
 * @param position a reverse-normalized position
 * @param rowsCount a number of rows of the hint's matrix
 * @param colsCount a number of columns of the hint's matrix
 * @result a reverse-normalized position, so that the center of the hint would be under the mouse 
 */
export const normalizeHintPosition: HintNormalizationFunction = ({ position: { x, z }, rowsCount, colsCount }) => ({
	x: x - ((rowsCount - 1) % 2) / 2,
	z: z - ((colsCount - 1) % 2) / 2
})
