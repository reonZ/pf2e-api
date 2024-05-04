import { DEGREE_OF_SUCCESS_STRINGS } from "../success";

declare global {
    type DegreeOfSuccessString = (typeof DEGREE_OF_SUCCESS_STRINGS)[number];

    type DegreeOfSuccessIndex = ZeroToThree;

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
        predicate?: Predicate;
    }

    type DegreeAdjustmentsRecord = {
        [key in "all" | DegreeOfSuccessString]?: { label: string; amount: DegreeAdjustmentAmount };
    };
}

export type {};
