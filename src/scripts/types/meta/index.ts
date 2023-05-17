import { ALIVE_CELL_VALUE, DEAD_CELL_VALUE } from "@/constants/simulation.settings"

export * from "./rules"
export * from "./templates"
export * from "./parser"

export type FieldMatrix = Array<Array<typeof ALIVE_CELL_VALUE | typeof DEAD_CELL_VALUE>>
