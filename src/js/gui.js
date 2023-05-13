// eslint-disable-next-line import/no-named-as-default
import GUI from "lil-gui"
import {
	INVERSION_STATE,
	REVIVAL_STATE,
	TERMINATION_STATE,
	DEFAULT_ITERATION_PER_SECOND,
	DEFAULT_ITERATION_PER_TIME
} from "./constants/simulation.settings"
import { EMPTY_FUNCTION } from "./constants/general"
import { templates } from "./life/templates"
import { rules } from "./life/rules"

export function initializeGUI({
	handleFieldClear = EMPTY_FUNCTION,
	handleFieldCopy = EMPTY_FUNCTION,
	handleRulesChange = EMPTY_FUNCTION,
	stateChangeHandler = EMPTY_FUNCTION,
	templateChangeHandler = EMPTY_FUNCTION,
	handleIterationsPerSecondChange = EMPTY_FUNCTION,
	handleIterationsPerTimeChange = EMPTY_FUNCTION,
	handleSimulationStateChange = EMPTY_FUNCTION
}) {
	const gui = new GUI()
	const generalFolder = gui.addFolder("Общее")
	generalFolder.close()
	const generalSettings = {
		"On/Off": handleSimulationStateChange,
		"Очистить поле": handleFieldClear,
		"Скопировать поле [с сжатием]": () => handleFieldCopy({ shouldReduce: true }),
		"Скопировать поле [без сжатия]": () => handleFieldCopy({ shouldReduce: false })
	}
	// ОБЩЕЕ
	Object.keys(generalSettings).forEach((key) => generalFolder.add(generalSettings, key))
	// НАСТРОЙКИ СИМУЛЯЦИИ
	const settingsFolder = generalFolder.addFolder("Настройки симуляции")
	settingsFolder.close()
	const simulationSettings = {
		"Итерации в секунду": DEFAULT_ITERATION_PER_SECOND,
		"Итерации за раз": DEFAULT_ITERATION_PER_TIME
	}
	settingsFolder
		.add(simulationSettings, "Итерации в секунду", 1, 100, 1)
		.onChange((value) => handleIterationsPerSecondChange({ value }))
	settingsFolder
		.add(simulationSettings, "Итерации за раз", 1, 100, 1)
		.onChange((value) => handleIterationsPerTimeChange({ value }))
	// ПРАВИЛА
	const rulesButtonHandler =
		({ rule }) =>
		() =>
			handleRulesChange({ rule })
	const rulesFolder = settingsFolder.addFolder("Правила")
	rulesFolder.close()
	const rules_ = Object.values(rules)
	const rulesOptions = rules_.reduce(
		(acc, rule) => ((acc[rule.name] = rulesButtonHandler({ rule })), acc),
		{}
	)
	rules_.forEach(({ name }) => rulesFolder.add(rulesOptions, name))

	// ШАБЛОНЫ
	const templateButtonHandler =
		({ template }) =>
		() =>
			templateChangeHandler({ template })
	const templatesFolder = gui.addFolder("Шаблоны")
	templatesFolder.close()
	const templates_ = Object.values(templates)
	const templatesOptions = templates_.reduce(
		(acc, template) => ((acc[template.guiName] = templateButtonHandler({ template })), acc),
		{}
	)
	templates_.forEach(({ guiName }) => templatesFolder.add(templatesOptions, guiName))

	// РЕЖИМЫ
	const statesFolder = gui.addFolder("Режимы")
	statesFolder.close()
	const insertStates = {
		Инверсирование: () => stateChangeHandler({ state: INVERSION_STATE }),
		Оживление: () => stateChangeHandler({ state: REVIVAL_STATE }),
		Уничтожение: () => stateChangeHandler({ state: TERMINATION_STATE })
	}
	statesFolder.add(insertStates, "Инверсирование")
	statesFolder.add(insertStates, "Оживление")
	statesFolder.add(insertStates, "Уничтожение")
}
