declare global {
    type CreatureActorType = "familiar" | "character" | "npc";

    type Language = string;
    type CreatureTrait = string;

    interface CreatureAttributesSource extends ActorAttributesSource {
        hp: CreatureHitPointsSource;
    }

    interface CreatureHitPointsSource extends ActorHitPointsSource {
        temp: number;
    }

    interface CreatureLanguagesData {
        value: Language[];
        details: string;
    }

    interface CreatureDetailsSource extends ActorDetailsSource {
        languages?: CreatureLanguagesData;
    }

    interface CreatureTraitsSource extends ActorTraitsSource<CreatureTrait> {}

    interface CreatureResourcesSource {
        focus?: {
            value: number;
            max?: number;
        };
    }

    interface CreatureDetails extends Required<CreatureDetailsSource> {}

    interface CreatureACData extends ArmorClassTraceData {
        attribute: AttributeString;
    }

    interface HeldShieldData {
        itemId: string | null;
        name: string;
        ac: number;
        hardness: number;
        brokenThreshold: number;
        hp: ValueAndMax;
        raised: boolean;
        broken: boolean;
        destroyed: boolean;
        icon: ImageFilePath;
    }

    interface LabeledSpeed extends Omit<LabeledNumber, "exceptions"> {
        type: Exclude<MovementType, "land">;
        source?: string;
        total?: number;
        derivedFromLand?: boolean;
    }

    interface CreatureSpeeds extends StatisticModifier {
        value: number;
        otherSpeeds: LabeledSpeed[];
        total: number;
    }

    interface CreatureAttributes extends ActorAttributes {
        hp: ActorHitPoints;
        ac: CreatureACData;
        hardness: { value: number };
        reach: {
            base: number;
            manipulate: number;
        };
        shield?: HeldShieldData;
        speed: CreatureSpeeds;
        dying: ValueAndMax & { recoveryDC: number };
        wounded: ValueAndMax;
        doomed: ValueAndMax;
        emitsSound: boolean;
    }

    type SenseAcuity = "precise" | "imprecise" | "vague";

    type SenseType =
        | "darkvision"
        | "echolocation"
        | "greater-darkvision"
        | "infrared-vision"
        | "lifesense"
        | "low-light-vision"
        | "motion-sense"
        | "scent"
        | "see-invisibility"
        | "spiritsense"
        | "thoughtsense"
        | "tremorsense"
        | "truesight"
        | "wavesense";

    type SpecialVisionType = Extract<
        SenseType,
        "low-light-vision" | "darkvision" | "greater-darkvision" | "see-invisibility"
    >;

    type SenseData =
        | { type: SpecialVisionType; acuity?: "precise"; range?: number; source?: Maybe<string> }
        | { type: SenseType; acuity: SenseAcuity; range: number; source?: Maybe<string> };

    interface CreatureTraitsData extends Required<CreatureTraitsSource> {
        size: ActorSizePF2e;
        naturalSize?: Size;
    }

    interface CreaturePerceptionData extends PerceptionTraceData {
        attribute: AttributeString;
    }

    interface AttributeBasedTraceData extends Omit<StatisticTraceData, "slug"> {
        attribute: AttributeString;
        value: number;
        breakdown: string;
        slug: SaveType;
    }

    interface SaveData extends AttributeBasedTraceData {
        saveDetail?: string;
    }

    type CreatureSaves = Record<SaveType, SaveData>;

    type SkillData = AttributeBasedTraceData;

    interface CreatureResources extends CreatureResourcesSource {
        focus: {
            value: number;
            max: number;
            cap: number;
        };
    }

    interface CreatureSystemData extends Omit<CreatureSystemSource, "attributes">, ActorSystemData {
        abilities?: Abilities;
        details: CreatureDetails;
        traits: CreatureTraitsData;
        attributes: CreatureAttributes;
        perception: CreaturePerceptionData;
        customModifiers: Record<string, ModifierPF2e[]>;
        damageDice: Record<string, DamageDicePF2e[]>;
        saves: CreatureSaves;
        skills: Record<string, SkillData>;
        actions?: StrikeData[];
        resources?: CreatureResources;
    }

    interface CreatureSystemSource extends ActorSystemSource {
        attributes: CreatureAttributesSource;
        details?: CreatureDetailsSource;
        traits?: CreatureTraitsSource;
        customModifiers?: Record<string, RawModifier[]>;
        saves?: Record<SaveType, object | undefined>;
        resources?: CreatureResourcesSource;
    }

    interface CreatureInitiativeSource {
        statistic: SkillLongForm | "perception";
    }

    type CreatureSource = FamiliarSource | CharacterSource | NPCSource;

    type BaseCreatureSource<
        TType extends CreatureActorType,
        TSystemSource extends CreatureSystemSource
    > = BaseActorSourcePF2e<TType, TSystemSource>;

    interface ChangeCarryTypeOptions {
        carryType: ItemCarryType;
        handsHeld?: ZeroToTwo;
        inSlot?: boolean;
    }

    abstract class CreaturePF2e extends ActorPF2e {
        skills: Record<SkillLongForm, Statistic<this>> & Record<string, Statistic<this>>;
        synthetics: RuleElementSynthetics<CreaturePF2e>;
        spellcasting: ActorSpellcasting<this>;
        parties: Set<PartyPF2e>;
        saves: Record<SaveType, Statistic>;

        get traits(): Set<CreatureTrait>;
        get hitPoints(): HitPointsSummary;
        get wornArmor(): ArmorPF2e<this> | null;

        changeCarryType(
            item: PhysicalItemPF2e<CreaturePF2e>,
            options: ChangeCarryTypeOptions
        ): Promise<void>;
    }

    interface CreaturePF2e {
        readonly _source: CreatureSource;
        system: CreatureSystemData;
    }
}

export type {};
