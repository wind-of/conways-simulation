import {
	normilizeIndex,
	mirroredIndex,
	positionToString,
	mirrorePosition,
	normilizePosition
} from "../../project/coordinates"

import {
	ALIVE_CELL_VALUE,
	DEAD_CELL_VALUE,
	NO_CELL_VALUE
} from "../../constants/simulation.settings"
import { CellValue, FieldMatrixControlsInitializer } from "@/types"

export const initializeFieldMatrixControls: FieldMatrixControlsInitializer = ({ matrix, matrixSize, settings }) => {
	const index = (d: number) => normilizeIndex({ d, max: matrixSize })
	const set = (x: number, z: number, v: CellValue) => (matrix[index(x)][index(z)] = v)
	const get = (x: number, z: number) => {
		x = mirroredIndex({ d: index(x), max: matrixSize })
		z = mirroredIndex({ d: index(z), max: matrixSize })

		return (matrix[x] && matrix[x][z]) || NO_CELL_VALUE
	}

	const getNeighboursPositions = ({ x, z }) => [
		{ x: x - 1, z: z - 1 },
		{ x: x - 1, z },
		{ x: x - 1, z: z + 1 },
		{ x, z: z - 1 },
		{ x, z: z + 1 },
		{ x: x + 1, z: z - 1 },
		{ x: x + 1, z },
		{ x: x + 1, z: z + 1 }
	]

	const revive = ({ x, z }) => set(x, z, ALIVE_CELL_VALUE)
	const kill = ({ x, z }) => set(x, z, DEAD_CELL_VALUE)
	const isAlive = ({ x, z }) => !!get(x, z)

	const willBeAlive = ({ x, z }) => {
		const isCellAlive = isAlive({ x, z })
		const neighboursCount = getNeighboursPositions({ x, z }).reduce(
			(a, { x, z }) => a + get(x, z),
			0
		)
		return settings.rulesFunction({ isAlive: isCellAlive, neighboursCount })
	}

	return {
		revive,
		kill,
		isAlive,
		willBeAlive,
		set,
		get,

		potentiallyActiveCells: [],
		positionsSet: new Set(),
		getPositionsToIterate({ shouldClear = false }) {
			const positions = this.potentiallyActiveCells.slice(0)
			if (shouldClear) {
				this.clearPotentiallyActivePositions()
			}
			return positions
		},
		clearPotentiallyActivePositions() {
			this.potentiallyActiveCells = []
			this.positionsSet.clear()
		},
		handlePositionChange(position) {
			if (!this.potentiallyActiveCells) {
				this.potentiallyActiveCells = []
			}
			const normalizedPosition = normilizePosition({ position, max: matrixSize })
			const mirroredPosition = mirrorePosition({
				position: normalizedPosition,
				max: matrixSize
			})
			const mirroredNeighbours = getNeighboursPositions(normalizedPosition).map((position) =>
				mirrorePosition({ position, max: matrixSize })
			)

			const newPositions = [mirroredPosition, ...mirroredNeighbours]
			for (let i = 0; i < newPositions.length; i++) {
				const key = positionToString(newPositions[i])
				if (this.positionsSet.has(key)) {
					continue
				}
				this.positionsSet.add(key)
				this.potentiallyActiveCells.push(newPositions[i])
			}
		}
	}
}
