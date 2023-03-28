export const ALIVE_CELL_VALUE = 1
export const DEAD_CELL_VALUE = 0
export const NO_CELL_VALUE = 0
export const ALIVE_CELL_LETTER = "o"
export const DEAD_CELL_LETTER = "b"
export const LIFE_STRING_NEWLINE_LETTER = "$"
export const LIFE_STRING_END_LETTER = "!"

export const CELL_TYPES = {
	[ALIVE_CELL_LETTER]: ALIVE_CELL_VALUE,
	[DEAD_CELL_LETTER]: DEAD_CELL_VALUE
}

export const DEFAULT_ITERATION_PER_SECOND = 100
export const DEFAULT_ITERATION_PER_TIME = 1
export const DEFAULT_MATRIX_SIZE = 50

export const NO_INTERSECTED_CELL = null

export const SECOND_MS = 1000

export const DEFAULT_Y_POSITION = 0

export const SPACE_KEY = " "

export const DEFAULT_FOV = 60
export const DEFAULT_NEAR = 0.1
export const DEFAULT_FAR = 10000

export const MOUSE_LEFT_BUTTON = 0

export const INVERSION_STATE = "INVERSION_STATE"
export const REVIVAL_STATE = "REVIVAL_STATE"
export const TERMINATION_STATE = "TERMINATION_STATE"

export const EMPTY_FUNCTION = () => {}

export const DEFAULT_NEIGHBOURS_FOR_BIRTH = [3]
export const DEFAULT_NEIGHBOURS_FOR_STAYING = [2, 3]
export const DEFAULT_RULES = {
	stay: DEFAULT_NEIGHBOURS_FOR_STAYING,
	birth: DEFAULT_NEIGHBOURS_FOR_BIRTH
}
