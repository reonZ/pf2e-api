declare global {
    class CombatantPF2e extends Combatant {
        get actor(): ActorPF2e | null;
        get encounter(): EncounterPF2e | null;
        get token(): TokenDocumentPF2e;
        get playersCanSeeName(): boolean;

        startTurn(): Promise<void>;
        endTurn(options: { round: number }): Promise<void>;
    }

    interface EncounterBudgets {
        trivial: number;
        low: number;
        moderate: number;
        severe: number;
        extreme: number;
    }

    type ThreatRating = keyof EncounterBudgets;

    interface EncounterMetrics {
        threat: ThreatRating;
        budget: { spent: number; max: number; partyLevel: number };
        award: { xp: number; recipients: ActorPF2e[] };
        participants: { party: ActorPF2e[]; opposition: ActorPF2e[] };
    }

    class EncounterPF2e extends Combat<CombatantPF2e> {
        metrics: EncounterMetrics | null;
    }

    interface EncounterPF2e {}

    class EncounterTrackerPF2e extends CombatTracker<EncounterPF2e> {
        validateDrop(event: any): void;
        setInitiativeFromDrop(newOrder: CombatantPF2e[], dropped: CombatantPF2e): void;
        saveNewOrder(newOrder: CombatantPF2e[]): Promise<void>;
    }
}

export type {};
