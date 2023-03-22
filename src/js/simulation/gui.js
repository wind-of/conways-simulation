// eslint-disable-next-line import/no-named-as-default
import GUI from "lil-gui"
import { INVERSION_STATE, REVIVAL_STATE, TERMINATION_STATE } from "../constants"

import { templates } from "../life-rules/templates"

export function initializeGUI({ stateChangeHandler = () => {}, templateChangeHandler = () => {} }) {
	const gui = new GUI()

	const templateButtonHandler =
		({ template }) =>
		() =>
			templateChangeHandler({ template })
	const templatesFolder = gui.addFolder("Шаблоны")
	const templates_ = Object.values(templates)
	const templatesOptions = templates_.reduce(
		(acc, template) => ((acc[template.guiName] = templateButtonHandler({ template })), acc),
		{}
	)
	templates_.forEach(({ guiName }) => templatesFolder.add(templatesOptions, guiName))

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
