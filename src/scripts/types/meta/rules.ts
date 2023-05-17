export type Rule = {
	name?: string
	stay: Array<number>
	birth: Array<number>
}
export type NamedRule = {
	name: string
	stay?: Array<number>
	birth?: Array<number>
}

export type RulesFunctionParams = {
	isAlive: boolean
	neighboursCount: number
}

export type RulesFunction = (params: RulesFunctionParams) => boolean

