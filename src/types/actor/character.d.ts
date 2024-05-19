declare global {
    type CharacterSkill<TActor extends CharacterPF2e> = Statistic<TActor> & { rank: ZeroToFour };

    type CharacterSkills<TActor extends CharacterPF2e> = Record<
        SkillLongForm,
        CharacterSkill<TActor>
    > &
        Record<string, CharacterSkill<TActor>>;

    type CharacterSource = BaseCreatureSource<"character", CharacterSystemSource> & {
        flags: DeepPartial<CharacterFlags>;
    };

    interface CharacterAttributes
        extends Omit<
                CharacterAttributesSource,
                "immunities" | "weaknesses" | "resistances" | "speed"
            >,
            CreatureAttributes {
        classDC: ClassDCData | null;
        spellDC: { rank: number; value: number } | null;
        classOrSpellDC: { rank: number; value: number };
        classhp: number;
        ancestryhp: number;
        handsFree: number;
        familiarAbilities: { value: number };
        hp: CharacterHitPoints;
        speed: CreatureSpeeds;
        shield: HeldShieldData;
        polymorphed: boolean;
        battleForm: boolean;
    }

    interface CharacterAttributesSource extends ActorAttributesSource {
        hp: {
            value: number;
            temp: number;
            sp?: { value: number };
        };
        speed: {
            value: number;
            otherSpeeds: {
                type: Exclude<MovementType, "land">;
                value: number;
            }[];
        };
    }

    interface CharacterDetailsSource extends CreatureDetailsSource {
        level: { value: number };
        languages: CreatureLanguagesData;
        keyability: { value: AttributeString };
        age: { value: string };
        height: { value: string };
        weight: { value: string };
        gender: { value: string };
        ethnicity: { value: string };
        nationality: { value: string };
        xp: {
            value: number;
            min: number;
            max: number;
            pct: number;
        };
    }

    interface AttributeBoostsSource {
        manual: boolean;

        boosts: {
            1?: AttributeString[];
            5?: AttributeString[];
            10?: AttributeString[];
            15?: AttributeString[];
            20?: AttributeString[];
        };
        apex?: AttributeString | null;
    }

    interface CharacterBuildSource {
        attributes?: AttributeBoostsSource;
    }

    interface MartialProficiencySource {
        rank: ZeroToFour;
        custom?: boolean;
    }

    interface CharacterResourcesSource {
        heroPoints: ValueAndMax;
        focus?: { value: number; max?: never };
        crafting?: { infusedReagents?: { value: number } };
        resolve?: { value: number };
    }

    interface CraftingFormulaData {
        uuid: ItemUUID;
        sort?: number;
        dc?: number;
        batchSize?: number;
        deletable?: boolean;
    }

    interface CharacterSystemSource extends CreatureSystemSource {
        abilities: Record<AttributeString, { mod: number }> | null;
        attributes: CharacterAttributesSource;
        details: CharacterDetailsSource;
        build?: CharacterBuildSource;
        proficiencies?: {
            attacks?: Record<string, MartialProficiencySource | undefined>;
        };
        resources: CharacterResourcesSource;
        initiative: CreatureInitiativeSource;
        crafting?: { formulas: CraftingFormulaData[] };
        perception?: never;
        saves?: never;
        traits?: never;
    }

    type CharacterFlags = ActorFlagsPF2e & {
        pf2e: {
            favoredWeaponRank: number;
            highestWeaponDamageDice: number;
            freeCrafting: boolean;
            quickAlchemy: boolean;
            disableABP?: boolean;
            sheetTabs: CharacterSheetTabVisibility;
            showBasicUnarmed: boolean;
        };
    };

    interface CharacterAbilityData extends AbilityData {
        base: number;
    }

    type CharacterAbilities = Record<AttributeString, CharacterAbilityData>;

    interface AttributeBoosts extends AttributeBoostsSource {
        keyOptions: AttributeString[];
        boosts: Required<AttributeBoostsSource["boosts"]> & {
            ancestry: AttributeString[];
            background: AttributeString[];
            class: AttributeString | null;
        };
        allowedBoosts: {
            1: number;
            5: number;
            10: number;
            15: number;
            20: number;
        };
        flaws: {
            ancestry: AttributeString[];
        };
        apex: AttributeString | null;
    }

    interface GrantedLanguage {
        slug: Language;
        source: string;
    }

    interface LanguageBuildData extends ValueAndMax {
        granted: GrantedLanguage[];
    }

    interface CharacterBuildData {
        attributes: AttributeBoosts;
        languages: LanguageBuildData;
    }

    interface CharacterSaveData extends SaveData {
        rank: ZeroToFour;
    }

    type CharacterSaves = Record<SaveType, CharacterSaveData>;

    interface DeityDetails extends Pick<DeitySystemData, "skill"> {
        weapons: BaseWeaponType[];
    }

    interface CharacterDeities {
        primary: DeityDetails | null;
        secondary: null;
        domains: { [K in DeityDomain]?: string };
    }

    interface CharacterDetails extends Omit<CharacterDetailsSource, "alliance">, CreatureDetails {
        ancestry: {
            name: string;
            trait: string;
            adopted: string | null;
            versatile: string | null;
            countsAs: string[];
        } | null;
        heritage: { name: string; trait: string | null } | null;
        class: { name: string; trait: string } | null;
        deities: CharacterDeities;
    }

    interface ClassDCData extends Required<AttributeBasedTraceData> {
        label: string;
        rank: ZeroToFour;
        primary: boolean;
    }

    interface CharacterHitPoints extends HitPointsStatistic {
        recoveryMultiplier: number;
        recoveryAddend: number;
        sp?: ValueAndMax;
    }

    interface CharacterPerceptionData extends CreaturePerceptionData {
        rank: ZeroToFour;
    }

    interface CharacterProficiency {
        label?: string;
        value: number;
        breakdown: string;
        rank: ZeroToFour;
    }

    interface MartialProficiency extends CharacterProficiency {
        label: string;
        definition?: Predicate;
        sameAs?: WeaponCategory | ArmorCategory;
        maxRank?: Exclude<ProficiencyRank, "untrained">;
        custom?: boolean;
    }

    interface CharacterSkillData extends SkillData {
        attribute: AttributeString;
        rank: ZeroToFour;
        armor: boolean;
        lore?: boolean;
        itemID?: string;
    }

    interface CharacterSystemData
        extends Omit<
                CharacterSystemSource,
                "customModifiers" | "perception" | "resources" | "saves" | "traits" | "attributes"
            >,
            CreatureSystemData {
        abilities: CharacterAbilities;
        build: CharacterBuildData;
        saves: CharacterSaves;
        details: CharacterDetails;
        attributes: CharacterAttributes;
        perception: CharacterPerceptionData;
        initiative: InitiativeData;
        proficiencies: {
            attacks: Record<WeaponCategory, MartialProficiency> &
                Record<string, MartialProficiency | undefined>;
            defenses: Record<ArmorCategory, MartialProficiency> &
                Record<string, MartialProficiency | undefined>;
            classDCs: Record<string, ClassDCData>;
            spellcasting: CharacterProficiency;
            aliases?: Record<string, string | undefined>;
        };
        skills: Record<SkillAbbreviation, CharacterSkillData>;
        actions: CharacterStrike[];
        resources: CharacterResources;
        crafting: CharacterCraftingData;
        exploration: string[];
    }

    interface CraftingEntryData {
        selector: string;
        name: string;
        item: ItemPF2e<CharacterPF2e>;
        isAlchemical: boolean;
        isDailyPrep: boolean;
        isPrepared: boolean;
        maxSlots?: number;
        craftableItems: RawPredicate;
        fieldDiscovery?: RawPredicate | null;
        batchSizes?: { default: number; other: { definition: RawPredicate; quantity: number }[] };
        fieldDiscoveryBatchSize?: number;
        maxItemLevel: number;
        preparedFormulaData?: PreparedFormulaData[];
    }

    interface PreparedFormulaData {
        itemUUID: string;
        quantity?: number;
        expended?: boolean;
        isSignatureItem?: boolean;
        sort?: number;
    }

    interface CharacterCraftingData {
        formulas: CraftingFormulaData[];
        entries: Record<string, Partial<CraftingEntryData>>;
    }

    interface CharacterResources extends CreatureResources {
        heroPoints: ValueAndMax;
        investiture: ValueAndMax;
        crafting: { infusedReagents: ValueAndMax };
        resolve?: ValueAndMax;
    }

    interface CharacterStrike extends StrikeData {
        item: WeaponPF2e<CharacterPF2e>;
        visible: boolean;
        domains: string[];
        handsAvailable: boolean;
        altUsages: CharacterStrike[];
        auxiliaryActions: WeaponAuxiliaryAction[];
        weaponTraits: TraitViewData[];
        doubleBarrel: { selected: boolean } | null;
        versatileOptions: VersatileWeaponOption[];
    }

    interface VersatileWeaponOption {
        value: DamageType;
        selected: boolean;
        label: string;
        glyph: string | null;
    }

    interface PreparedCraftingFormula extends CraftingFormula {
        quantity: number;
        expended: boolean;
        isSignatureItem: boolean;
        sort: number;
    }

    interface CraftingEntry extends CraftingEntryData {
        preparedCraftingFormulas: PreparedCraftingFormula[];

        get reagentCost(): number;
    }

    interface CraftingFormula extends CraftingFormulaData {
        item: PhysicalItemPF2e;
    }

    class CharacterPF2e extends CreaturePF2e {
        ancestry: AncestryPF2e<this> | null;
        // heritage: HeritagePF2e<this> | null;
        // background: BackgroundPF2e<this> | null;
        class: ClassPF2e<this> | null;
        // deity: DeityPF2e<this> | null;

        familiar: FamiliarPF2e | null;
        skills: CharacterSkills<this>;
        classDC: Statistic<CharacterPF2e> | null;
        classDCs: Record<string, Statistic<CharacterPF2e>>;
        synthetics: RuleElementSynthetics<CharacterPF2e>;

        get heroPoints(): ValueAndMax;
        get abilities(): CharacterAbilities;
        get attributes(): CharacterAttributes;

        getCraftingEntries(formulas?: CraftingFormula[]): Promise<CraftingEntry[]>;
    }

    interface CharacterPF2e {
        readonly _source: CharacterSource;
        system: CharacterSystemData;
        flags: CharacterFlags;
    }
}

export type {};
