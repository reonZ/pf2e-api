declare class RollNotePF2e {
    selector: string;
    title: string | null;
    text: string;
    predicate: Predicate;
    outcome: DegreeOfSuccessString[];
    visibility: UserVisibility | null;
    rule: RuleElementPF2e | null;
    constructor(params: RollNoteParams);
    static notesToHTML(notes: RollNotePF2e[]): HTMLUListElement | null;
    toHTML(): HTMLLIElement;
    clone(): RollNotePF2e;
    toObject(): RollNoteSource;
}
export { RollNotePF2e };
