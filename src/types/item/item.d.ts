declare global {
    interface PublicationData {
        title: string;
        authors: string;
        license: "ORC" | "OGL";
        remaster: boolean;
    }

    interface ItemInstances<TParent extends ActorPF2e = ActorPF2e> {
        action: AbilityItemPF2e<TParent>;
        affliction: ItemPF2e<TParent>;
        ancestry: AncestryPF2e<TParent>;
        armor: ArmorPF2e<TParent>;
        background: ItemPF2e<TParent>;
        backpack: ContainerPF2e<TParent>;
        book: ItemPF2e<TParent>;
        campaignFeature: ItemPF2e<TParent>;
        class: ItemPF2e<TParent>;
        condition: ConditionPF2e<TParent>;
        consumable: ConsumablePF2e<TParent>;
        deity: ItemPF2e<TParent>;
        effect: EffectPF2e<TParent>;
        equipment: EquipmentPF2e<TParent>;
        feat: FeatPF2e<TParent>;
        heritage: ItemPF2e<TParent>;
        kit: ItemPF2e<TParent>;
        lore: ItemPF2e<TParent>;
        melee: ItemPF2e<TParent>;
        shield: ShieldPF2e<TParent>;
        spell: SpellPF2e<TParent>;
        spellcastingEntry: SpellcastingEntryPF2e<TParent>;
        treasure: TreasurePF2e<TParent>;
        weapon: WeaponPF2e<TParent>;
    }

    type ItemType = keyof ItemInstances<ActorPF2e>;

    interface ItemTraits {
        value: string[];
        rarity: Rarity;
        otherTags: string[];
    }

    type ItemGrantDeleteAction = "cascade" | "detach" | "restrict";

    interface ItemGrantSource {
        id: string;
        onDelete?: ItemGrantDeleteAction;
    }

    type ItemGrantData = Required<ItemGrantSource>;

    interface ItemFlagsPF2e {
        [k: string]: any;
        pf2e: {
            rulesSelections: Record<string, string | number | object | null>;
            itemGrants: Record<string, ItemGrantData>;
            grantedBy: ItemGrantData | null;
            [key: string]: unknown;
        };
    }

    interface ItemTraitsNoRarity extends Omit<ItemTraits, "rarity"> {
        rarity?: never;
    }

    interface RarityTraitAndOtherTags {
        readonly value?: never;
        rarity: Rarity;
        otherTags: string[];
    }

    interface OtherTagsOnly {
        readonly value?: never;
        rarity?: never;
        otherTags: string[];
    }

    interface ItemDescriptionSource {
        gm: string;
        value: string;
    }

    interface AlteredDescriptionContent {
        title: string | null;
        text: string;
        divider: boolean;
    }

    interface ItemDescriptionData extends ItemDescriptionSource {
        addenda: {
            label: string;
            contents: AlteredDescriptionContent[];
        }[];
        override: AlteredDescriptionContent[] | null;
    }

    type ItemSystemSource = {
        level?: { value: number };
        description: ItemDescriptionSource;
        traits: ItemTraits | ItemTraitsNoRarity | RarityTraitAndOtherTags | OtherTagsOnly;
        rules: RuleElementSource[];
        slug: string | null;
        publication: PublicationData;
    };

    interface ItemSystemData extends ItemSystemSource {
        description: ItemDescriptionData;
    }

    type BaseItemSourcePF2e<
        TType extends ItemType,
        TSystemSource extends ItemSystemSource = ItemSystemSource
    > = ItemSourceData<TType, TSystemSource>;

    interface ActionCost {
        type: Exclude<ActionType, "passive">;
        value: OneToThree | null;
    }

    type ItemSourcePF2e =
        | PhysicalItemSource
        | AbilitySource
        | AfflictionSource
        | AncestrySource
        // | BackgroundSource
        // | CampaignFeatureSource
        | ClassSource
        | ConditionSource
        | DeitySource
        | EffectSource
        | FeatSource
        // | HeritageSource
        // | KitSource
        | LoreSource
        // | MeleeSource
        | SpellSource
        | SpellcastingEntrySource;

    interface EnrichmentOptionsPF2e extends EnrichmentOptions {
        rollData?: RollDataPF2e;
        processVisibility?: boolean;
    }

    interface TraitChatData {
        value: string;
        label: string;
        description?: string;
        mystified?: boolean;
        excluded?: boolean;
    }

    interface RawItemChatData {
        [key: string]: unknown;
        description: ItemDescriptionData;
        traits?: TraitChatData[];
        properties?: string[];
    }

    class ItemPF2e<TParent extends ActorPF2e = ActorPF2e> extends Item<TParent> {
        type: ItemType;

        get sourceId(): string | null;
        get level(): number;
        get description(): string;
        get slug(): string | null;
        get sheet(): ItemSheetPF2e<this>;
        get quantity(): number;

        toDragData(): { type: string; itemType: string; [key: string]: unknown };
        getOriginData(): ItemOriginFlag;
        getRollOptions(prefix?: string, options?: { includeGranter: boolean }): string[];

        isOfType<T extends "physical" | ItemType>(
            ...types: T[]
        ): this is T extends "physical"
            ? PhysicalItemPF2e<TParent>
            : T extends ItemType
            ? ItemInstances<TParent>[T]
            : never;

        static fromDropData<TDocument extends foundry.abstract.Document>(
            this: ConstructorOf<TDocument>,
            data: object,
            options?: Record<string, unknown>
        ): Promise<TDocument | undefined>;
        static fromDropData(
            data: object,
            options?: Record<string, unknown>
        ): Promise<foundry.abstract.Document | undefined>;

        toMessage(
            event?: Maybe<Event | JQuery.TriggeredEvent>,
            options?: {
                rollMode?: RollMode | "roll";
                create?: boolean;
                data?: Record<string, unknown>;
            }
        ): Promise<ChatMessagePF2e | undefined>;

        getChatData(
            htmlOptions?: EnrichmentOptionsPF2e,
            _rollOptions?: Record<string, unknown>
        ): Promise<RawItemChatData>;
    }

    interface ItemPF2e {
        readonly _source: ItemSourcePF2e;
        system: ItemSystemData;
        flags: ItemFlagsPF2e;
    }
}

export type {};
