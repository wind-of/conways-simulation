// '5b2o$6bo$4bo$2obob4o$2obo5bobo$3bo2b3ob2o$3bo4bo$4b3obo$7bo$6bo$6b2o!'
/*
	b - мертвые
	o - живые
	$ - следующая строка
	! - конец
	
	Пример: 5b - следующие 5 клеток - мертвые.
*/
import { ALIVE_CELL_VALUE, DEAD_CELL_VALUE } from "../constants/simulation.settings"
import {
	CELL_TYPES,
	DEAD_CELL_LETTER,
	LIFE_STRING_NEWLINE_LETTER,
	LIFE_STRING_END_LETTER,
	ALIVE_CELL_LETTER
} from "../constants/meta"
import { TemplateStringParcerFunction, EncodeMatrixToTemplateStringFunction } from "@/types"

export const templateStringParcerParser: TemplateStringParcerFunction = ({ string, height, width }) => {
	const matrix = Array.from({ length: height }, () => Array(width).fill(0))
	const makeStep = ({ x, y, v }) => {
		matrix[x][y] = v
		return (y + 1) % width
	}
	for (let i = 0, x = 0, y = 0; i < string.length; i++) {
		let char: string | number = string[i]
		const v = CELL_TYPES[char]
		if (char === LIFE_STRING_END_LETTER) {
			break
		}
		if (char === LIFE_STRING_NEWLINE_LETTER) {
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
			const v = CELL_TYPES[state]
			for (let k = 0; k < +char; k++) {
				y = makeStep({ x, y, v })
			}
			i++
		}
	}
	return matrix
}

export const encodeMatrixToTemplateString: EncodeMatrixToTemplateStringFunction = (matrix) => {
	let result = ""
	if (matrix.length === 0) {
		return result
	}
	const getPrefix = (v: number) => (v > 1 ? v : "")
	const rows = matrix.length
	const cols = matrix[0].length
	for (let x = 0, o = 0, b = 0; x < rows; x++, o = 0, b = 0) {
		if (result) {
			result += LIFE_STRING_NEWLINE_LETTER
		}
		for (let y = 0; y < cols; y++) {
			if (matrix[x][y] === ALIVE_CELL_VALUE) {
				if (b) {
					result += `${getPrefix(b)}${DEAD_CELL_LETTER}`
					b = 0
				}
				o++
				continue
			} else if (matrix[x][y] === DEAD_CELL_VALUE) {
				if (o) {
					result += `${getPrefix(o)}${ALIVE_CELL_LETTER}`
					o = 0
				}
				b++
			}
		}
		if (o) {
			result += `${getPrefix(o)}${ALIVE_CELL_LETTER}`
		}
	}
	return result + LIFE_STRING_END_LETTER
}
