export const SIMPLE_GLIDER = "SIMPLE_GLIDER"
export const SIMPLE_INFINITE_GROWTH = "SIMPLE_INFINITE_GROWTH"
export const SPIRAL_V1 = "SPIRAL_V1"
export const SPIRAL_V2 = "SPIRAL_V2"
export const DOT = "DOT"
export const BOX_2X2 = "BOX_2X2"
export const CRAB = "CRAB"
export const JELLYFISH = "JELLYFISH"
export const CLOCK = "CLOCK"
export const CRAB_V2 = "CRAB_V2"

// width - x, height - y
export const templates = {
	[DOT]: {
		name: DOT,
		guiName: "Точка",
		string: "o!",
		width: 1,
		height: 1
	},
	[BOX_2X2]: {
		name: DOT,
		guiName: "Квадрат 2x2",
		string: "2o$2o!",
		width: 2,
		height: 2
	},
	[SIMPLE_GLIDER]: {
		name: SIMPLE_GLIDER,
		guiName: "Простой глайдер",
		string: "bo$2bo$3o!",
		width: 3,
		height: 3
	},
	[SPIRAL_V1]: {
		name: SPIRAL_V1,
		guiName: "Спираль v1",
		string: "6ob2o$6ob2o$7b2o$2o5b2o$2o5b2o$2o5b2o$2o$2ob6o$2ob6o!",
		height: 9,
		width: 9
	},
	[SPIRAL_V2]: {
		name: SPIRAL_V2,
		guiName: "Спираль v2",
		string: `16bo12bo$9b2o24b2o$8b3o3b2o14b2o3b3o$14b2ob2o8b2ob2o$16bo12bo$$$$2bo40bo$b2o40b2o$b2o40b2o$$$$2b2o38b2o$2b2o38b2o$o3bo36bo3bo$3bo38bo$3bo38bo$$$$$$$$$3bo38bo$3bo38bo$o3bo36bo3bo$2b2o38b2o$2b2o38b2o$$$$b2o40b		2o$b2o40b2o$2bo40bo$$$$16bo12bo$14b2ob2o8b2ob2o$8b3o3b2o14b2o3b3o$9b2o24b2o$16bo12bo!`,
		height: 46,
		width: 46
	},
	[SIMPLE_INFINITE_GROWTH]: {
		name: SIMPLE_INFINITE_GROWTH,
		guiName: "Простая бесконечнорастущая комбинация",
		string: `6bo$4bob2o$4bobo$4bo$2bo$obo!`,
		height: 8,
		width: 8
	},
	[CRAB]: {
		name: CRAB,
		guiName: "Краб",
		string: `o2bo$4bo$o3bo$b4o!`,
		height: 5,
		width: 5
	},
	[CRAB_V2]: {
		name: CRAB_V2,
		guiName: "Краб v2",
		string: "8b2o$7b2o$9bo$11b2o$10bo$$9bo2bo$b2o5b2o$2o5bo$2bo4bobo$4b2o2bo$4b2o!",
		height: 13,
		width: 13
	},
	[JELLYFISH]: {
		name: JELLYFISH,
		guiName: "Медуза",
		string: "o$2o$3o!",
		height: 3,
		width: 3
	},
	[CLOCK]: {
		name: CLOCK,
		guiName: "Часы",
		string: "2bo$obo$bobo$bo!",
		height: 4,
		width: 4
	}
}

export const DEFAULT_TEMPLATE = templates[DOT]
