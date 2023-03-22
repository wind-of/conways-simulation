import {
	reverseNormilizeCoordinates,
	normilizeIndex,
	positionToString,
	normilizeCoordinates
} from "../three/coordinates"
import { fullyTerminateMesh, cloneMesh } from "../three/root"

import {
	ALIVE_CELL_VALUE,
	DEAD_CELL_VALUE,
	INVERSION_STATE,
	NO_CELL_VALUE,
	REVIVAL_STATE,
	TERMINATION_STATE
} from "../constants"
import { aliveCellMesh } from "../three/meshes/cell"
import { initializeHint } from "./hint"
import { DOT, templates } from "../life-rules/templates"

// TODO: terminationState для инверсии живых клеток по шаблону
// TODO: изменения не происходят, пока intersectedCell не обновится

export function initializeFieldControls({
	matrix,
	matrixSize = matrix.length,
	root,
	shouldInitializeHint = true
}) {
	const objects = {}
	const hint = shouldInitializeHint
		? initializeHint({ globalRoot: root, template: templates[DOT] })
		: null
	if (hint) {
		root.add(hint.root)
	}

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
		state: REVIVAL_STATE,
		setState({ state }) {
			this.state = state
		},

		hint,
		animate({ time }) {
			if (this.hint) {
				this.hint.animate({ time })
			}
		},
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
		applyHintTemplateToField({ center }) {
			const { templateMatrix } = this.hint
			const normalizedCenter = normilizeCoordinates({ position: center, max: matrixSize })
			const rowsCount = templateMatrix.length
			const columnsCount = templateMatrix[0].length
			const startX = normalizedCenter.x - Math.floor(columnsCount / 2)
			const startZ = normalizedCenter.z - Math.floor(rowsCount / 2)

			for (let x = 0; x < columnsCount; x++)
				for (let z = 0; z < rowsCount; z++) {
					const fieldPosition = reverseNormilizeCoordinates({
						position: { x: x + startX, z: z + startZ },
						max: matrixSize
					})
					const stateHandlers = {
						[REVIVAL_STATE]: () => {
							const value = templateMatrix[x][z] ? ALIVE_CELL_VALUE : DEAD_CELL_VALUE
							changes.push({ position: fieldPosition, value })
						},
						[TERMINATION_STATE]: () => {
							if (templateMatrix[x][z]) {
								changes.push({ position: fieldPosition, value: DEAD_CELL_VALUE })
							}
						},
						[INVERSION_STATE]: () => {
							const value = templateMatrix[x][z] ? DEAD_CELL_VALUE : ALIVE_CELL_VALUE
							changes.push({ position: fieldPosition, value })
						}
					}
					stateHandlers[this.state]()
				}
			this.applyChanges()
			this.display()
		},
		handleCellChange({ position }) {
			this.applyHintTemplateToField({ center: position })
		},

		applyChanges() {
			changes.forEach(({ value, position: { x, z } }) => set(x, z, value))
			changes = []
		},
		iterate(position_) {
			const position = reverseNormilizeCoordinates({ position: position_, max: matrixSize })
			const value = willBeAlive(position) ? ALIVE_CELL_VALUE : DEAD_CELL_VALUE
			changes.push({ position, value })
		},
		reviveCell({ position }) {
			const mesh = this.getObjectAtPosition({ position })
			if (mesh) {
				return
			}
			const aliveCell = cloneMesh(aliveCellMesh, position)
			this.saveObject(aliveCell)
			revive(position)
			this.root.add(aliveCell)
		},
		terminateCell({ position }) {
			const mesh = this.getObjectAtPosition({ position })
			if (!mesh) {
				return
			}
			fullyTerminateMesh(root, mesh)
			this.removeObject(position)
			kill(position)
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
