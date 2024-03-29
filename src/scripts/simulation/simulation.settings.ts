import * as THREE from "three"

import { defaultRulesFunction } from "../meta/rules"
import {
	DEFAULT_ITERATION_PER_SECOND,
	DEFAULT_ITERATION_PER_TIME,
	DEFAULT_MATRIX_SIZE,
	DEFAULT_Y_POSITION
} from "../constants/simulation.settings"
import { zeroMatrix } from "../utils.ts"
import { SetupSimulationSettingsFunction } from "@/types"

export const setupSimulationSettings: SetupSimulationSettingsFunction = (options = {}) => ({
	rulesFunction: defaultRulesFunction(),
	iterationsPerSecond: DEFAULT_ITERATION_PER_SECOND,
	iterationsPerTime: DEFAULT_ITERATION_PER_TIME,
	yPosition: DEFAULT_Y_POSITION,
	matrixSize: DEFAULT_MATRIX_SIZE,
	offset: new THREE.Vector3(0, 0, 0),
	matrix: zeroMatrix(options.matrixSize || DEFAULT_MATRIX_SIZE),
	...options,

	setIterationsPerSecond({ value }) {
		this.iterationsPerSecond = value
	},
	setIterationsPerTime({ value }) {
		this.iterationsPerTime = value
	}
})
