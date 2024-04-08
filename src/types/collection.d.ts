declare global {
    class DelegatedCollection<V> extends Collection<V> {}

    class SpellCollection<TActor extends ActorPF2e> extends Collection<SpellPF2e<TActor>> {
        constructor(entry: BaseSpellcastingEntry<TActor>, name?: string);

        entry: BaseSpellcastingEntry<TActor>;
        actor: TActor;
        name: string;

        get id(): string;
        get highestRank(): OneToTen;

        addSpell(
            spell: SpellPF2e,
            options?: { groupId?: Maybe<SpellSlotGroupId> }
        ): Promise<SpellPF2e<TActor> | null>;
        getSpellData(options?: { prepList?: boolean }): Promise<SpellCollectionData>;
        prepareSpell(
            spell: SpellPF2e,
            groupId: SpellSlotGroupId,
            slotIndex: number
        ): Promise<this | null>;
    }
}

export type {};
