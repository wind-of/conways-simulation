export const SIMPLE_GLIDER = "SIMPLE_GLIDER"
export const SIMPLE_INFINITE_GROWTH = "SIMPLE_INFINITE_GROWTH"
export const SPIRAL_V1 = "SPIRAL_V1"
export const SPIRAL_V2 = "SPIRAL_V2"
export const DOT = "DOT"

export const templates = {
	[SIMPLE_GLIDER]: {
		name: SIMPLE_GLIDER,
		guiName: "Простой глайдер",
		string: "bo$2bo$3o!",
		width: 3,
		height: 3
	},
	[DOT]: {
		name: DOT,
		guiName: "Точка",
		string: "o!",
		width: 1,
		height: 1
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
	}
}
