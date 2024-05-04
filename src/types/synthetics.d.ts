declare global {
    interface RollSubstitution {
        slug: string;
        label: string;
        predicate: Predicate;
        value: number;
        required: boolean;
        selected: boolean;
        effectType: "fortune" | "misfortune";
    }
}

export type {};
