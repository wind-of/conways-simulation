// '5b2o$6bo$4bo$2obob4o$2obo5bobo$3bo2b3ob2o$3bo4bo$4b3obo$7bo$6bo$6b2o!'
/*
	b - мертвые
	o - живые
	$ - следующая строка
	! - конец
	
	Пример: 5b - следующие 5 клеток - мертвые.
*/
const mapCellTypes = { o: 1, b: 0 }

export function lifeRulesParser({ string, height, width }) {
	const matrix = Array.from({ length: height }, () => Array(width).fill(0))
	const makeStep = ({ x, y, v }) => {
		matrix[x][y] = v
		return (y + 1) % width
	}
	for (let i = 0, x = 0, y = 0; i < string.length; i++) {
		let char = string[i]
		const v = mapCellTypes[char]
		if (char === "!") {
			break
		}
		if (char === "$") {
			x++
			y = 0
			continue
		}
		if (v !== undefined) {
			y = makeStep({ x, y, v })
		} else {
			while (!Number.isNaN(+string[i + 1])) {
				char += string[i + 1]
				i++
			}
			const state = string[i + 1]
			const v = mapCellTypes[state]
			for (let k = 0; k < char; k++) {
				y = makeStep({ x, y, v })
			}
			i++
		}
	}
	return matrix
}
