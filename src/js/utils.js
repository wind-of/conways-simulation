export const zeroArray = (length) => Array.from({ length }, () => 0)
export const zeroMatrix = (length) => Array.from({ length }, () => zeroArray(length))

export const randomArray = (length) => Array.from({ length }, () => Math.round(Math.random()))
export const randomMatrix = (length) => Array.from({ length }, () => randomArray(length))
