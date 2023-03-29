export const RULE_B3S23 = "B3/S23"
export const RULE_B245S368 = "B245/S368"
export const RULE_B23S38 = "B23/S38"

export const rules = {
	[RULE_B3S23]: {
		name: RULE_B3S23,
		birth: [3],
		stay: [2, 3]
	},
	[RULE_B245S368]: {
		name: RULE_B245S368,
		birth: [2, 4, 5],
		stay: [3, 6, 8]
	},
	[RULE_B23S38]: {
		name: RULE_B23S38,
		birth: [2, 3],
		stay: [3, 8]
	}
}

export function rulesFunctionFactory(rule) {
	const { stay, birth } = rules[rule.name] || rule
	return ({ isAlive, neighboursCount }) =>
		isAlive ? stay.includes(neighboursCount) : birth.includes(neighboursCount)
}

export function defaultRulesFunction() {
	return rulesFunctionFactory({ name: RULE_B3S23 })
}
