import { PredicatePF2e } from "..";

declare global {
    interface RollSubstitution {
        slug: string;
        label: string;
        predicate: PredicatePF2e;
        value: number;
        required: boolean;
        selected: boolean;
        effectType: "fortune" | "misfortune";
    }
}

export type {};
