// eslint-disable-next-line import/no-named-as-default
import GUI from "lil-gui"

import { templates } from "../life-rules/templates"

export function initializeGUI({ templateChangeHandler = () => {} }) {
	const gui = new GUI()

	const templateButtonHandler =
		({ template }) =>
		() =>
			templateChangeHandler({ template })
	const folder = gui.addFolder("Шаблоны")
	const templates_ = Object.values(templates)
	const templatesOptions = templates_.reduce(
		(acc, template) => ((acc[template.guiName] = templateButtonHandler({ template })), acc),
		{}
	)
	templates_.forEach(({ guiName }) => folder.add(templatesOptions, guiName))
}
