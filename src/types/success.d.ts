import { PredicatePF2e } from "..";

declare global {
    type DegreeOfSuccessString = "criticalFailure" | "failure" | "success" | "criticalSuccess";

    type DegreeAdjustmentAmount =
        | 1
        | 2
        | -1
        | -2
        | "criticalFailure"
        | "failure"
        | "success"
        | "criticalSuccess";

    interface CheckDC {
        slug?: string | null;
        statistic?: StatisticDifficultyClass | null;
        label?: string;
        scope?: "attack" | "check";
        value: number;
        visible?: boolean;
    }

    interface DegreeOfSuccessAdjustment {
        adjustments: DegreeAdjustmentsRecord;
        predicate?: PredicatePF2e;
    }

    type DegreeAdjustmentsRecord = {
        [key in "all" | DegreeOfSuccessString]?: { label: string; amount: DegreeAdjustmentAmount };
    };
}

export type {};
