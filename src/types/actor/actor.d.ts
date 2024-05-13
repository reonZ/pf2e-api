import { RollNotePF2e } from "../../notes";

declare global {
    type BaseActorSourcePF2e<
        TType extends ActorType,
        TSystemSource extends ActorSystemSource = ActorSystemSource
    > = ActorSourceData<TType, TSystemSource>;

    type ActorAlliance = "party" | "opposition" | null;

    type Abilities = Record<AttributeString, AbilityData>;

    type ActorUUID = string;

    interface AbilityData {
        mod: number;
        label: string;
        shortLabel: string;
    }

    interface ActorDetails extends ActorDetailsSource {
        level: { value: number };
        alliance: ActorAlliance;
    }

    interface ActorHitPoints extends Required<BaseHitPointsSource> {
        unrecoverable: number;
        negativeHealing: boolean;
    }

    interface ActorAttributes extends ActorAttributesSource {
        hp?: ActorHitPoints;
        ac?: { value: number };
        immunities: Immunity[];
        weaknesses: Weakness[];
        resistances: Resistance[];
        shield?: {
            raised: boolean;
            broken: boolean;
        };
        flanking: {
            canFlank: boolean;
            canGangUp: GangUpCircumstance[];
            flankable: boolean;
            offGuardable: OffGuardableCircumstance;
        };
    }

    interface ActorSystemData extends ActorSystemSource {
        abilities?: Abilities;
        details: ActorDetails;
        actions?: StrikeData[];
        attributes: ActorAttributes;
        traits?: ActorTraitsData<string>;
        initiative?: InitiativeTraceData;
        autoChanges: Record<string, AutoChangeEntry[] | undefined>;
    }

    interface ActorDetailsSource {
        level?: { value: number };
        alliance?: ActorAlliance;
    }

    interface ActorTraitsSource<TTrait extends string> {
        value: TTrait[];
        rarity?: Rarity;
        size?: { value: Size };
    }

    interface ActorHitPointsSource extends ValueAndMaybeMax {
        temp?: number;
    }

    interface WeaknessSource extends IWRSource<WeaknessType> {
        value: number;
    }

    interface ResistanceSource extends IWRSource<ResistanceType> {
        value: number;
        doubleVs?: IWRException<ResistanceType>[];
    }

    interface ActorAttributesSource {
        hp?: ActorHitPointsSource;
        immunities?: ImmunitySource[];
        weaknesses?: WeaknessSource[];
        resistances?: ResistanceSource[];
    }

    type ActorSystemSource = {
        details?: ActorDetailsSource;
        attributes: ActorAttributesSource;
        traits?: ActorTraitsSource<string>;
    };

    interface ActorInstances {
        army: ArmorPF2e;
        character: CharacterPF2e;
        creature: CreaturePF2e;
        familiar: FamiliarPF2e;
        hazard: HazardPF2e;
        loot: LootPF2e;
        party: PartyPF2e;
        npc: NPCPF2e;
        vehicle: ActorPF2e;
    }

    type ActorType = keyof ActorInstances;

    type ActorFlagsPF2e = {
        [k: string]: any;
        pf2e: {
            rollOptions: RollOptionFlags;
            trackedItems: Record<string, string>;
            [key: string]: unknown;
        };
    };

    class TokenEffect implements TemporaryEffect {
        isTemporary: boolean;
        duration: PreparedEffectDurationData;
    }

    interface ApplyDamageParams {
        damage: number | Rolled<DamageRoll>;
        token: TokenDocumentPF2e;
        item?: ItemPF2e<ActorPF2e> | null;
        skipIWR?: boolean;
        rollOptions?: Set<string>;
        shieldBlockRequest?: boolean;
        breakdown?: string[];
        outcome?: DegreeOfSuccessString | null;
        notes?: RollNotePF2e[];
        final?: boolean;
    }

    class ActorPF2e extends Actor {
        type: ActorType;
        skills?: Record<string, Statistic<this>>;
        saves?: { [K in SaveType]?: Statistic };
        spellcasting: ActorSpellcasting<this> | null;
        synthetics: RuleElementSynthetics;
        inventory: ActorInventory<this>;
        rules: RuleElementPF2e[];
        conditions: ActorConditions<this>;

        get level(): number;
        get sourceId(): string | null;
        get attributes(): this["system"]["attributes"];
        get abilities(): Abilities | null;
        get itemTypes(): EmbeddedItemInstances<this>;
        get slug(): string;
        get size(): Size;
        get hitPoints(): HitPointsSummary | null;
        get alliance(): ActorAlliance;
        get combatant(): CombatantPF2e | null;
        get primaryUpdater(): UserPF2e | null;
        get token(): TokenDocumentPF2e | null;
        get isDead(): boolean;

        getSelfRollOptions(prefix?: "self" | "target" | "origin"): string[];
        getContextualClone(
            rollOptions: string[],
            ephemeralEffects?: (ConditionSource | EffectSource)[]
        ): this;

        applyDamage(options: ApplyDamageParams): Promise<this>;

        hasCondition(...slugs: ConditionSlug[]): boolean;
        getStatistic(slug: string): Statistic<this> | null;
        getRollOptions(domains?: string[]): string[];

        getActiveTokens(linked: boolean | undefined, document: true): TokenDocumentPF2e[];
        getActiveTokens(linked?: boolean | undefined, document?: false): TokenPF2e[];
        getActiveTokens(linked?: boolean, document?: boolean): TokenDocumentPF2e[] | TokenPF2e[];

        isOfType<T extends "creature" | ActorType>(...types: T[]): this is ActorInstances[T];
        isOfType(...types: string[]): boolean;

        transferItemToActor(
            targetActor: ActorPF2e,
            item: ItemPF2e<ActorPF2e>,
            quantity: number,
            containerId?: string,
            newStack?: boolean
        ): Promise<PhysicalItemPF2e<ActorPF2e> | null>;

        addToInventory(
            itemSource: PhysicalItemSource,
            container?: ContainerPF2e<this>,
            newStack?: boolean
        ): Promise<PhysicalItemPF2e<this> | null>;

        createEmbeddedDocuments(
            embeddedName: "Item",
            data: (PreCreate<ItemSourcePF2e> | ItemSourcePF2e)[],
            context?: DocumentModificationContext<this>
        ): Promise<ItemPF2e<this>[]>;
        updateEmbeddedDocuments(
            embeddedName: "Item",
            updateData: EmbeddedDocumentUpdateData<ItemSourcePF2e>[],
            options?: DocumentModificationContext<this>
        ): Promise<ItemPF2e<this>[]>;

        deleteEmbeddedDocuments(
            embeddedName: "Item",
            dataId: string[],
            context?: DocumentModificationContext<this>
        ): Promise<ItemPF2e[]>;

        getActiveTokens(linked: boolean | undefined, document: true): TokenDocumentPF2e[];
        getActiveTokens(linked?: boolean | undefined, document?: false): TokenPF2e[];
        getActiveTokens(linked?: boolean, document?: boolean): TokenDocumentPF2e[] | TokenPF2e[];

        getDependentTokens(options?: {
            scenes?: Scene | Scene[];
            linked?: boolean;
        }): TokenDocumentPF2e[];
    }

    type ActorSourcePF2e = ArmySource | CreatureSource | HazardSource | LootSource | PartySource;
    // | VehicleSource;

    interface ActorPF2e {
        readonly _source: ActorSourcePF2e;
        system: ActorSystemData;
        items: EmbeddedCollection<ItemPF2e<this>>;
        flags: ActorFlagsPF2e;
    }
}

export type {};
