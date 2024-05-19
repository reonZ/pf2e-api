declare global {
    type NPCSource = BaseCreatureSource<"npc", NPCSystemSource> & {
        flags: DeepPartial<NPCFlags>;
    };

    type NPCFlags = ActorFlagsPF2e & {
        pf2e: { lootable: boolean };
    };

    type NPCSavesSource = Record<SaveType, { value: number; saveDetail: string }>;

    interface NPCTraitsSource extends Required<CreatureTraitsSource> {}

    interface NPCHitPointsSource extends Required<CreatureHitPointsSource> {
        details: string;
    }

    interface NPCPerceptionSource {
        details: string;
        mod: number;
        senses: SenseData[];
        vision: boolean;
    }

    interface NPCSaveData extends SaveData {
        base?: number;
        saveDetail: string;
    }

    interface NPCSaves {
        fortitude: NPCSaveData;
        reflex: NPCSaveData;
        will: NPCSaveData;
    }

    interface NPCHitPoints extends HitPointsStatistic {
        base?: number;
    }

    interface NPCSkillData extends AttributeBasedTraceData {
        base: number;
        itemId: string | null;
        lore: boolean;
        mod: number;
        variants: { label: string; options: string }[];
        visible: boolean;
    }

    interface NPCSpeeds extends CreatureSpeeds {
        details: string;
    }

    interface NPCDetails extends NPCDetailsSource, CreatureDetails {
        level: {
            value: number;
            base: number;
        };
        alliance: ActorAlliance;
    }

    interface NPCPerceptionData extends CreaturePerceptionData {
        mod: number;
    }

    interface NPCAttributes
        extends Omit<
                NPCAttributesSource,
                "ac" | "initiative" | "immunities" | "weaknesses" | "resistances"
            >,
            CreatureAttributes {
        adjustment: "elite" | "weak" | null;
        hp: NPCHitPoints;
        speed: NPCSpeeds;
        allSaves: { value: string };
        familiarAbilities: StatisticModifier;
        classDC: { value: number };
        spellDC: { value: number } | null;
        classOrSpellDC: { value: number };
    }

    interface NPCStrike extends StrikeData {
        item: MeleePF2e<ActorPF2e>;
        attackRollType?: string;
        sourceId?: string;
        additionalEffects: { tag: string; label: string }[];
        altUsages?: never;
    }

    interface NPCSystemData
        extends Omit<NPCSystemSource, "attributes" | "perception" | "traits">,
            CreatureSystemData {
        abilities: Abilities;
        saves: NPCSaves;
        details: NPCDetails;
        perception: NPCPerceptionData;
        initiative: InitiativeTraceData;
        attributes: NPCAttributes;
        skills: Record<string, NPCSkillData>;
        actions: NPCStrike[];
        resources: CreatureResources;
        spellcasting: {
            rituals: { dc: number };
        };
        customModifiers: Record<string, ModifierPF2e[]>;
    }

    interface NPCAttributesSource extends Required<ActorAttributesSource> {
        ac: {
            value: number;
            details: string;
        };
        adjustment: "elite" | "weak" | null;
        hp: NPCHitPointsSource;
        speed: {
            value: number;
            otherSpeeds: LabeledSpeed[];
            details: string;
        };
        allSaves: {
            value: string;
        };
    }

    interface NPCDetailsSource extends CreatureDetailsSource {
        level: {
            value: number;
        };
        languages: CreatureLanguagesData;
        blurb: string;
        publicNotes: string;
        privateNotes: string;
        publication: PublicationData;
    }

    interface NPCSystemSource extends CreatureSystemSource {
        traits: NPCTraitsSource;
        abilities: Abilities;
        attributes: NPCAttributesSource;
        perception: NPCPerceptionSource;
        initiative: CreatureInitiativeSource;
        details: NPCDetailsSource;
        saves: NPCSavesSource;
        spellcasting?: {
            rituals?: {
                dc: number;
            };
        };
        resources: CreatureResourcesSource;
    }

    interface RecallKnowledgeDC {
        dc: number;
        progression: number[];
        start: DCAdjustment;
    }

    interface CreatureIdentificationData {
        skills: SkillLongForm[];
        standard: RecallKnowledgeDC;
        lore: [RecallKnowledgeDC, RecallKnowledgeDC];
    }

    class NPCPF2e extends CreaturePF2e {
        get abilities(): Abilities;
        get identificationDCs(): CreatureIdentificationData;

        applyAdjustment(adjustment: "elite" | "weak" | null): Promise<void>;
    }

    interface NPCPF2e {
        flags: NPCFlags;
        readonly _source: NPCSource;
        system: NPCSystemData;
    }
}

export type {};
