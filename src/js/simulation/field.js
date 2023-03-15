import { reverseNormilizeCoordinates, normilizeIndex, positionToString } from "../three/coordinates"
import { fullyTerminateMesh, cloneMesh } from "../three/root"

import {
	ALIVE_CELL_VALUE,
	DEAD_CELL_VALUE,
	DEFAULT_Y_POSITION,
	NO_CELL_VALUE,
	DEFAULT_MATRIX_SIZE
} from "../constants"
import { createAliveCellMesh, aliveCellMesh } from "../three/meshes/cell"
import { hintOpacityAnimation, hintTerminationOpacityAnimation } from "../three/animation"
import { COLOR_BLUE, COLOR_WHITE } from "../three/colors"

export function initializeFieldControls({ matrix, matrixSize = DEFAULT_MATRIX_SIZE, root }) {
	const objects = {}

	const hintMesh = createAliveCellMesh()
	hintMesh.material.visible = false
	root.add(hintMesh)

	const index = (d) => normilizeIndex(d, matrixSize)
	const mirroredIndex = ({ d, max }) => {
		const offset = d < 0 ? max : d >= max ? -max : 0
		return d + offset
	}
	const set = (x, z, v) => (matrix[index(x)][index(z)] = v)
	const get = (x, z) => {
		x = mirroredIndex({ d: index(x), max: matrixSize })
		z = mirroredIndex({ d: index(z), max: matrixSize })

		return (matrix[x] && matrix[x][z]) || NO_CELL_VALUE
	}

	const revive = ({ x, z }) => set(x, z, ALIVE_CELL_VALUE)
	const kill = ({ x, z }) => set(x, z, DEAD_CELL_VALUE)
	const isAlive = ({ x, z }) => !!get(x, z)

	const willBeAlive = ({ x, z }) => {
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
		root,
		matrix,
		objects,

		hintMesh,
		hintAnimationFunction: hintOpacityAnimation,
		setHintVisibility(value) {
			this.hintMesh.material.visible = value
		},
		setHintPosition({ x, z }) {
			this.hintMesh.position.set(x, DEFAULT_Y_POSITION + 0.008, z)
		},
		setHintsDefaultState() {
			this.hintAnimationFunction = hintOpacityAnimation
			this.hintMesh.material.color = COLOR_WHITE
			this.setHintVisibility(true)
		},
		setHintsTerminationState() {
			this.hintAnimationFunction = hintTerminationOpacityAnimation
			this.hintMesh.material.color = COLOR_BLUE
		},
		isHintVisible() {
			return this.hintMesh.visible
		},
		animateHint({ time }) {
			if (!this.isHintVisible()) {
				return
			}
			this.hintMesh.material.opacity = this.hintAnimationFunction(time)
		},

		revive,
		kill,
		isAlive,

		saveObject(mesh) {
			const key = positionToString(mesh.position)
			objects[key] = mesh
		},
		getObjectAtPosition({ position }) {
			return objects[positionToString(position)]
		},
		removeObject(position) {
			objects[positionToString(position)] = null
		},
		handleCellChange({ position }) {
			return this.getObjectAtPosition({ position })
				? this.terminateCell({ position })
				: this.reviveCell({ position })
		},

		applyChanges() {
			changes.forEach(({ value, position: { x, z } }) => set(x, z, value))
			changes = []
		},
		iterate(position_) {
			const position = reverseNormilizeCoordinates({ position: position_, max: matrixSize })
			const isCellAlive = isAlive(position)
			if (willBeAlive(position)) {
				return !isCellAlive && changes.push({ position, value: ALIVE_CELL_VALUE })
			} else {
				return isCellAlive && changes.push({ position, value: DEAD_CELL_VALUE })
			}
		},
		reviveCell({ position }) {
			const mesh = this.getObjectAtPosition({ position })
			if (mesh) {
				return
			}
			const aliveCell = cloneMesh(aliveCellMesh, position)
			this.saveObject(aliveCell)
			this.revive(position)
			this.root.add(aliveCell)
		},
		terminateCell({ position }) {
			const mesh = this.getObjectAtPosition({ position })
			if (!mesh) {
				return
			}
			fullyTerminateMesh(root, mesh)
			this.removeObject(position)
			this.kill(position)
		},
		display() {
			for (let x = 0; x < matrixSize; x++)
				for (let z = 0; z < matrixSize; z++) {
					const position = reverseNormilizeCoordinates({ position: { x, z }, max: matrixSize })
					matrix[x][z] === ALIVE_CELL_VALUE
						? this.reviveCell({ position })
						: this.terminateCell({ position })
				}
		}
	}
}
