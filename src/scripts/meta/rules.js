export const RULE_S23B3 = "S23/B3"
export const RULE_S245B368 = "S245/B368"
export const RULE_S23B38 = "S23/B38"

export const rules = {
	[RULE_S23B3]: {
		name: RULE_S23B3,
		stay: [2, 3],
		birth: [3]
	},
	[RULE_S245B368]: {
		name: RULE_S245B368,
		stay: [2, 4, 5],
		birth: [3, 6, 8]
	},
	[RULE_S23B38]: {
		name: RULE_S23B38,
		stay: [2, 3],
		birth: [3, 8]
	}
}

export function rulesFunctionFactory(rule) {
	const { stay, birth } = rules[rule.name] || rule
	return ({ isAlive, neighboursCount }) =>
		isAlive ? stay.includes(neighboursCount) : birth.includes(neighboursCount)
}

export function defaultRulesFunction() {
	return rulesFunctionFactory({ name: RULE_S23B3 })
}
