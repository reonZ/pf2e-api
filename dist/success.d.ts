declare const DEGREE_OF_SUCCESS_STRINGS: readonly ["criticalFailure", "failure", "success", "criticalSuccess"];
type RollBrief = {
    dieValue: number;
    modifier: number;
};
declare class DegreeOfSuccess {
    #private;
    readonly value: DegreeOfSuccessIndex;
    readonly unadjusted: DegreeOfSuccessIndex;
    readonly adjustment: {
        label: string;
        amount: DegreeAdjustmentAmount;
    } | null;
    readonly dieResult: number;
    readonly rollTotal: number;
    readonly dc: CheckDC;
    constructor(roll: Rolled<CheckRoll> | RollBrief, dc: CheckDC | number, dosAdjustments?: DegreeAdjustmentsRecord | null);
    static readonly CRITICAL_FAILURE = 0;
    static readonly FAILURE = 1;
    static readonly SUCCESS = 2;
    static readonly CRITICAL_SUCCESS = 3;
}
export { DEGREE_OF_SUCCESS_STRINGS, DegreeOfSuccess };
