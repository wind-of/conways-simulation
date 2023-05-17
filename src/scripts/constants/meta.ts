import { ALIVE_CELL_VALUE, DEAD_CELL_VALUE } from "./simulation.settings"

export const ALIVE_CELL_LETTER = "o" as const
export const DEAD_CELL_LETTER = "b" as const
export const LIFE_STRING_NEWLINE_LETTER = "$" as const
export const LIFE_STRING_END_LETTER = "!" as const

export const CELL_TYPES = {
	[ALIVE_CELL_LETTER]: ALIVE_CELL_VALUE,
	[DEAD_CELL_LETTER]: DEAD_CELL_VALUE
}
