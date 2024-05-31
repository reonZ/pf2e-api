declare global {
    interface CollectionGetOptions {
        strict?: boolean;
    }

    class DelegatedCollection<V> {
        [Symbol.iterator](): IterableIterator<V>;

        get size(): number;
        get contents(): V[];

        get<T extends V = V>(key: Maybe<string>, { strict }: { strict: true }): T;
        get<T extends V = V>(key: string, options?: CollectionGetOptions): T | undefined;
        get(key: string, options?: CollectionGetOptions): V | undefined;

        getName<T extends V = V>(name: Maybe<string>, { strict }: { strict: true }): T;
        getName<T extends V = V>(name: string, options?: CollectionGetOptions): T | undefined;
        getName(name: string, options?: CollectionGetOptions): V | undefined;

        set(key: string, value: V): this;

        has(key: string): boolean;

        find(predicate: (value: V) => boolean): V | undefined;

        some(predicate: (value: V) => boolean): boolean;

        filter<T extends V = V>(condition: (value: V) => value is T): T[];
        filter<T extends V = V>(condition: (value: V) => unknown): T[];
        filter<T extends V = V>(predicate: (value: V) => boolean): T[];

        map<T>(callback: (value: V) => T): T[];

        flatMap<U>(callback: (value: V, index: number, array: V[]) => U | readonly U[]): U[];

        delete(key: string): boolean;

        clear(): void;
    }

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
        setSlotExpendedState(
            groupId: SpellSlotGroupId,
            slotIndex: number,
            value: boolean
        ): Promise<this | null>;
    }

    class ActorConditions<TActor extends ActorPF2e> extends DelegatedCollection<
        ConditionPF2e<TActor>
    > {
        get active(): ConditionPF2e<TActor>[];
        get stored(): ConditionPF2e<TActor>[];
        get clumsy(): ConditionPF2e<TActor> | null;
        get doomed(): ConditionPF2e<TActor> | null;
        get drained(): ConditionPF2e<TActor> | null;
        get dying(): ConditionPF2e<TActor> | null;
        get enfeebled(): ConditionPF2e<TActor> | null;
        get frightened(): ConditionPF2e<TActor> | null;
        get sickened(): ConditionPF2e<TActor> | null;
        get slowed(): ConditionPF2e<TActor> | null;
        get stunned(): ConditionPF2e<TActor> | null;
        get stupefied(): ConditionPF2e<TActor> | null;
        get wounded(): ConditionPF2e<TActor> | null;

        hasType(slug: ConditionSlug): boolean;
        every(condition: (value: ConditionPF2e<TActor>) => boolean): boolean;

        override get(
            key: Maybe<string>,
            options: { strict: true; active?: boolean | null; temporary?: boolean | null }
        ): ConditionPF2e<TActor>;
        override get(
            key: string,
            options?: ConditionsGetOptions
        ): ConditionPF2e<TActor> | undefined;
        override get(
            key: string,
            options?: ConditionsGetOptions
        ): ConditionPF2e<TActor> | undefined;

        set(id: string, condition: ConditionPF2e<TActor>): this;

        bySlug(
            slug: "persistent-damage",
            options?: ConditionsBySlugOptions
        ): PersistentDamagePF2e<TActor>[];
        bySlug(slug: "dead", options?: ConditionsBySlugOptions): never[];
        bySlug(
            slug: ConditionSlug | "dead",
            options?: ConditionsBySlugOptions
        ): ConditionPF2e<TActor>[];
        bySlug(slug: string, options?: ConditionsBySlugOptions): ConditionPF2e<TActor>[];
    }
}

export type {};
