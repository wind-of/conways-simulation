import { normilizeIndex } from "../../three/coordinates"

import { ALIVE_CELL_VALUE, DEAD_CELL_VALUE, NO_CELL_VALUE } from "../../constants"

export function initializeFieldMatrixControls({ matrix, matrixSize, settings }) {
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
		const neighboursCount =
			get(x - 1, z - 1) +
			get(x - 1, z) +
			get(x - 1, z + 1) +
			get(x, z - 1) +
			get(x, z + 1) +
			get(x + 1, z - 1) +
			get(x + 1, z) +
			get(x + 1, z + 1)
		return settings.rulesFunction({ isAlive: isCellAlive, neighboursCount })
	}

	return {
		revive,
		kill,
		isAlive,
		willBeAlive,
		set,
		get
	}
}
