import * as THREE from "three"

export const positionToString = ({ x, z }) => `x${x};z${z}`

export const normilizeIndex = (d, max) => Math.ceil(max / 2 + Math.round(d) - 1)
export const reverseNormilizeIndex = (d, max) => d - max / 2 + 0.5
export const normilizeCoordinates = ({ x, z }, max) => ({
	x: normilizeIndex(x, max),
	z: normilizeIndex(z, max)
})
export const reverseNormilizeCoordinates = ({ position: { x, z }, max }) => ({
	x: reverseNormilizeIndex(x, max),
	z: reverseNormilizeIndex(z, max)
})

export const normalizedRaycasterObjectPosition = ({ object, offsetVector }) => {
	const position = new THREE.Vector3().copy(object.point).floor().addScalar(0.5)
	if (offsetVector) {
		position.add(offsetVector)
	}
	return position
}
