declare global {
    class CombatantPF2e extends Combatant {
        get actor(): ActorPF2e | null;
        get encounter(): EncounterPF2e | null;
        get token(): TokenDocumentPF2e;

        startTurn(): Promise<void>;
        endTurn(options: { round: number }): Promise<void>;
    }

    class EncounterPF2e extends Combat {
        readonly combatants: EmbeddedCollection<CombatantPF2e>;
    }
}

export type {};
