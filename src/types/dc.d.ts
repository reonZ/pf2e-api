declare global {
    type NegativeDCAdjustment = "incredibly-easy" | "very-easy" | "easy" | "normal";

    type PositiveDCAdjustment = "normal" | "hard" | "very-hard" | "incredibly-hard";

    type DCAdjustment = NegativeDCAdjustment | PositiveDCAdjustment;

    interface DCOptions {
        pwol?: boolean;
        rarity?: Rarity;
    }
}

export type {};
