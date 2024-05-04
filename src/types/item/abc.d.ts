declare global {
    interface ABCFeatureEntryData {
        uuid: string;
        img: ImageFilePath;
        name: string;
        level: number;
    }

    interface ABCSystemSource extends ItemSystemSource {
        items: Record<string, ABCFeatureEntryData>;
    }

    interface ABCSystemData extends Omit<ABCSystemSource, "description">, ItemSystemData {}

    type AncestrySource = BaseItemSourcePF2e<"ancestry", AncestrySystemSource>;

    type CreatureTraits = TraitsWithRarity<CreatureTrait>;
    type AncestryTraits = ItemTraits<CreatureTrait>;

    interface AncestrySystemSource extends ABCSystemSource {
        traits: AncestryTraits;
        additionalLanguages: {
            count: number; // plus int
            value: string[];
            custom: string;
        };
        alternateAncestryBoosts?: AttributeString[];
        boosts: Record<string, { value: AttributeString[]; selected: AttributeString | null }>;
        flaws: Record<string, { value: AttributeString[]; selected: AttributeString | null }>;
        voluntary?: {
            boost?: AttributeString | null;
            flaws: AttributeString[];
        };
        hp: number;
        languages: ValuesList<Language>;
        speed: number;
        size: Size;
        reach: number;
        vision: "normal" | "darkvision" | "low-light-vision";
        level?: never;
    }

    type ClassSource = BaseItemSourcePF2e<"class", ClassSystemSource>;

    interface ClassSystemSource extends ABCSystemSource {
        traits: RarityTraitAndOtherTags;
        keyAbility: { value: AttributeString[]; selected: AttributeString | null };
        hp: number;
        perception: ZeroToFour;
        savingThrows: Record<SaveType, ZeroToFour>;
        attacks: ClassAttackProficiencies;
        defenses: ClassDefenseProficiencies;
        spellcasting: ZeroToFour;
        trainedSkills: {
            value: SkillAbbreviation[];
            additional: number;
        };
        ancestryFeatLevels: { value: number[] };
        classFeatLevels: { value: number[] };
        generalFeatLevels: { value: number[] };
        skillFeatLevels: { value: number[] };
        skillIncreaseLevels: { value: number[] };
        level?: never;
    }

    interface ClassSystemData
        extends Omit<ClassSystemSource, "description">,
            Omit<ABCSystemData, "level" | "traits"> {}

    interface ClassAttackProficiencies {
        simple: ZeroToFour;
        martial: ZeroToFour;
        advanced: ZeroToFour;
        unarmed: ZeroToFour;
        other: { name: string; rank: ZeroToFour };
    }

    interface ClassDefenseProficiencies {
        unarmored: ZeroToFour;
        light: ZeroToFour;
        medium: ZeroToFour;
        heavy: ZeroToFour;
    }

    type ClassTrait = string;

    interface AncestrySystemData
        extends Omit<AncestrySystemSource, "description" | "items">,
            Omit<ABCSystemData, "level" | "traits"> {}

    abstract class ABCItemPF2e<TParent extends ActorPF2e> extends ItemPF2e<TParent> {}

    interface ABCItemPF2e<TParent extends ActorPF2e> extends ItemPF2e<TParent> {
        readonly _source:
            | AncestrySource
            // | BackgroundSource
            | ClassSource;
        system:
            | AncestrySystemData
            // | BackgroundSystemData
            | ClassSystemData;
    }

    class AncestryPF2e<TParent extends ActorPF2e = ActorPF2e> extends ABCItemPF2e<TParent> {
        get size(): Size;
    }

    interface AncestryPF2e {
        readonly _source: AncestrySource;
        system: AncestrySystemData;
    }

    class ClassPF2e<TParent extends ActorPF2e = ActorPF2e> extends ABCItemPF2e<TParent> {}

    interface ClassPF2e {
        readonly _source: ClassSource;
        system: ClassSystemData;

        get slug(): ClassTrait | null;
    }
}

export type {};
