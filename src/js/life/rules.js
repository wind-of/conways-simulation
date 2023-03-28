import {
	DEFAULT_NEIGHBOURS_FOR_STAYING,
	DEFAULT_NEIGHBOURS_FOR_BIRTH,
	DEFAULT_RULES
} from "../constants"

export function rulesFunctionFactory({
	stay = DEFAULT_NEIGHBOURS_FOR_STAYING,
	birth = DEFAULT_NEIGHBOURS_FOR_BIRTH
}) {
	return ({ isAlive, neighboursCount }) =>
		isAlive ? stay.includes(neighboursCount) : birth.includes(neighboursCount)
}

export function defaultRulesFunction() {
	return rulesFunctionFactory(DEFAULT_RULES)
}
