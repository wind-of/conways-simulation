// eslint-disable-next-line import/no-named-as-default
import GUI from "lil-gui"
import { INVERSION_STATE, REVIVAL_STATE, TERMINATION_STATE, EMPTY_FUNCTION } from "./constants"

import { templates } from "./life/templates"

EMPTY_FUNCTION

export function initializeGUI({
	handleFieldClear = EMPTY_FUNCTION,
	handleFieldCopy = EMPTY_FUNCTION,
	stateChangeHandler = EMPTY_FUNCTION,
	templateChangeHandler = EMPTY_FUNCTION
}) {
	const gui = new GUI()
	const generalFolder = gui.addFolder("Общее")
	generalFolder.close()
	const generalSettings = {
		"Очистить поле": () => handleFieldClear(),
		"Скопировать поле [с сжатием]": () => handleFieldCopy({ shouldReduce: true }),
		"Скопировать поле [без сжатия]": () => handleFieldCopy({ shouldReduce: false })
	}
	// ОБЩЕЕ
	Object.keys(generalSettings).forEach((key) => generalFolder.add(generalSettings, key))

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
