import { reverseNormilizeCoordinates, normilizeIndex, positionToKey } from "../three/coordinates"
import { fullyTerminateMesh, cloneMesh } from "../three/root"

import {
	ALIVE_CELL_VALUE,
	DEAD_CELL_VALUE,
	DEFAULT_Y_POSITION,
	NO_CELL_VALUE,
	DEFAULT_MATRIX_SIZE
} from "../constants"
import { createAliveCellMesh, aliveCellMesh } from "../three/meshes/cell"
import { hintOpacityAnimation } from "../three/animation"
import { zeroMatrix } from "../utils"

export function initializeFieldControls({ matrix, matrixSize = DEFAULT_MATRIX_SIZE, root }) {
	matrix = matrix || zeroMatrix(matrixSize)

	const objects = {}

	const hintMesh = createAliveCellMesh()
	hintMesh.material.visible = false
	root.add(hintMesh)

	const index = (d) => normilizeIndex(d, matrixSize)
	const set = (x, z, v) => (matrix[index(x)][index(z)] = v)
	const get = (x, z) => (matrix[index(x)] && matrix[index(x)][index(z)]) || NO_CELL_VALUE

	const revive = ({ x, z }) => set(x, z, ALIVE_CELL_VALUE)
	const kill = ({ x, z }) => set(x, z, DEAD_CELL_VALUE)
	const isAlive = ({ x, z }) => !!get(x, z)

	const shouldBeAlive = ({ x, z }) => {
		const isCellAlive = isAlive({ x, z })
		const count =
			get(x - 1, z - 1) +
			get(x - 1, z) +
			get(x - 1, z + 1) +
			get(x, z - 1) +
			get(x, z + 1) +
			get(x + 1, z - 1) +
			get(x + 1, z) +
			get(x + 1, z + 1)
		return isCellAlive ? count > 1 && count < 4 : count === 3
	}
	let changes = []

	return {
		matrix,
		objects,
		hintMesh,
		setHintVisibility(value) {
			this.hintMesh.material.visible = value
		},
		setHintPosition({ x, z }) {
			this.hintMesh.position.set(x, DEFAULT_Y_POSITION, z)
		},
		isHintVisible() {
			return this.hintMesh.visible
		},
		animateHint({ time }) {
			if (!this.isHintVisible()) {
				return
			}
			this.hintMesh.material.opacity = hintOpacityAnimation(time)
		},

		revive,
		kill,
		isAlive,

		saveObject(mesh) {
			const key = positionToKey(mesh.position)
			objects[key] = mesh
		},
		getObject(position) {
			return objects[positionToKey(position)]
		},
		removeObject(position) {
			objects[positionToKey(position)] = null
		},
		applyChanges() {
			changes.forEach(({ value, position: { x, z } }) => set(x, z, value))
			changes = []
		},
		iterate(coordinates) {
			const position = reverseNormilizeCoordinates(coordinates, matrixSize)
			const isCellAlive = isAlive(position)
			if (shouldBeAlive(position)) {
				return !isCellAlive && changes.push({ position, value: ALIVE_CELL_VALUE })
			} else {
				return isCellAlive && changes.push({ position, value: DEAD_CELL_VALUE })
			}
		},
		display() {
			for (let x = 0; x < matrixSize; x++)
				for (let z = 0; z < matrixSize; z++) {
					const position = reverseNormilizeCoordinates({ x, z }, matrixSize)
					const mesh = this.getObject(position)
					if (matrix[x][z] === ALIVE_CELL_VALUE) {
						if (mesh) {
							continue
						}
						const aliveCell = cloneMesh(aliveCellMesh, position)
						this.saveObject(aliveCell)
						root.add(aliveCell)
					} else if (mesh) {
						this.removeObject(position)
						fullyTerminateMesh(root, mesh)
					}
				}
		}
	}
}
