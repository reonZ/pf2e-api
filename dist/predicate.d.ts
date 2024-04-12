declare class PredicatePF2e extends Array<PredicateStatement> {
    #private;
    /** Is the predicate data structurally valid? */
    readonly isValid: boolean;
    constructor(...statements: PredicateStatement[] | [PredicateStatement[]]);
    /** Structurally validate the predicates */
    static isValid(statements: unknown): statements is PredicateStatement[];
    /** Is this an array of predicatation statements? */
    static isArray(statements: unknown): statements is PredicateStatement[];
    /** Test if the given predicate passes for the given list of options. */
    static test(predicate: PredicateStatement[] | undefined, options: Set<string> | string[]): boolean;
    /** Test this predicate against a domain of discourse */
    test(options: Set<string> | string[]): boolean;
    toObject(): RawPredicate;
    clone(): PredicatePF2e;
}
export { PredicatePF2e };
