const DEGREE_OF_SUCCESS_STRINGS = [
    "criticalFailure",
    "failure",
    "success",
    "criticalSuccess",
] as const;

type RollBrief = { dieValue: number; modifier: number };

const DEGREE_ADJUSTMENT_AMOUNTS = {
    LOWER_BY_TWO: -2,
    LOWER: -1,
    INCREASE: 1,
    INCREASE_BY_TWO: 2,
    TO_CRITICAL_FAILURE: "criticalFailure",
    TO_FAILURE: "failure",
    TO_SUCCESS: "success",
    TO_CRITICAL_SUCCESS: "criticalSuccess",
} as const;

class DegreeOfSuccess {
    readonly value: DegreeOfSuccessIndex;
    readonly unadjusted: DegreeOfSuccessIndex;
    readonly adjustment: { label: string; amount: DegreeAdjustmentAmount } | null;
    readonly dieResult: number;
    readonly rollTotal: number;
    readonly dc: CheckDC;

    constructor(
        roll: Rolled<CheckRoll> | RollBrief,
        dc: CheckDC | number,
        dosAdjustments: DegreeAdjustmentsRecord | null = null
    ) {
        if (roll instanceof Roll) {
            this.dieResult =
                (roll.isDeterministic
                    ? roll.terms.find((t): t is NumericTerm => t instanceof NumericTerm)
                    : roll.dice.find((d): d is Die => d instanceof Die && d.faces === 20)
                )?.total ?? 1;
            this.rollTotal = roll.total;
        } else {
            this.dieResult = roll.dieValue;
            this.rollTotal = roll.dieValue + roll.modifier;
        }

        this.dc = typeof dc === "number" ? { value: dc } : dc;

        this.unadjusted = this.#calculateDegreeOfSuccess();
        this.adjustment = this.#getDegreeAdjustment(this.unadjusted, dosAdjustments);
        this.value = this.adjustment
            ? this.#adjustDegreeOfSuccess(this.adjustment.amount, this.unadjusted)
            : this.unadjusted;
    }

    static readonly CRITICAL_FAILURE = 0;
    static readonly FAILURE = 1;
    static readonly SUCCESS = 2;
    static readonly CRITICAL_SUCCESS = 3;

    #getDegreeAdjustment(
        degree: DegreeOfSuccessIndex,
        adjustments: DegreeAdjustmentsRecord | null
    ): { label: string; amount: DegreeAdjustmentAmount } | null {
        if (!adjustments) return null;

        for (const outcome of ["all", ...DEGREE_OF_SUCCESS_STRINGS] as const) {
            const { label, amount } = adjustments[outcome] ?? {};
            if (
                amount &&
                label &&
                !(
                    degree === DegreeOfSuccess.CRITICAL_SUCCESS &&
                    amount === DEGREE_ADJUSTMENT_AMOUNTS.INCREASE
                ) &&
                !(
                    degree === DegreeOfSuccess.CRITICAL_FAILURE &&
                    amount === DEGREE_ADJUSTMENT_AMOUNTS.LOWER
                ) &&
                (outcome === "all" || DEGREE_OF_SUCCESS_STRINGS.indexOf(outcome) === degree)
            ) {
                return { label, amount };
            }
        }

        return null;
    }

    #adjustDegreeOfSuccess(
        amount: DegreeAdjustmentAmount,
        degreeOfSuccess: DegreeOfSuccessIndex
    ): DegreeOfSuccessIndex {
        switch (amount) {
            case "criticalFailure":
                return 0;
            case "failure":
                return 1;
            case "success":
                return 2;
            case "criticalSuccess":
                return 3;
            default:
                return Math.clamp(degreeOfSuccess + amount, 0, 3) as DegreeOfSuccessIndex;
        }
    }

    #adjustDegreeByDieValue(degree: DegreeOfSuccessIndex): DegreeOfSuccessIndex {
        if (this.dieResult === 20) {
            return this.#adjustDegreeOfSuccess(DEGREE_ADJUSTMENT_AMOUNTS.INCREASE, degree);
        } else if (this.dieResult === 1) {
            return this.#adjustDegreeOfSuccess(DEGREE_ADJUSTMENT_AMOUNTS.LOWER, degree);
        }

        return degree;
    }

    #calculateDegreeOfSuccess(): DegreeOfSuccessIndex {
        const dc = this.dc.value;

        if (this.rollTotal - dc >= 10) {
            return this.#adjustDegreeByDieValue(DegreeOfSuccess.CRITICAL_SUCCESS);
        } else if (dc - this.rollTotal >= 10) {
            return this.#adjustDegreeByDieValue(DegreeOfSuccess.CRITICAL_FAILURE);
        } else if (this.rollTotal >= dc) {
            return this.#adjustDegreeByDieValue(DegreeOfSuccess.SUCCESS);
        }

        return this.#adjustDegreeByDieValue(DegreeOfSuccess.FAILURE);
    }
}

export { DEGREE_OF_SUCCESS_STRINGS, DegreeOfSuccess };
