import { ALIVE_CELL_VALUE, DEAD_CELL_VALUE } from "../constants/simulation.settings"

export const ALIVE_CELL_LETTER = "o"
export const DEAD_CELL_LETTER = "b"
export const LIFE_STRING_NEWLINE_LETTER = "$"
export const LIFE_STRING_END_LETTER = "!"

export const CELL_TYPES = {
	[ALIVE_CELL_LETTER]: ALIVE_CELL_VALUE,
	[DEAD_CELL_LETTER]: DEAD_CELL_VALUE
}
