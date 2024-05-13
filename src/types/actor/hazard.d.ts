declare global {
    type HazardSource = BaseActorSourcePF2e<"hazard", HazardSystemSource>;

    type HazardSystemSource = Omit<
        ActorSystemSource,
        "details" | "attributes" | "saves" | "traits"
    > & {
        details: HazardDetailsSource;
        attributes: HazardAttributesSource;
        saves: HazardSaves;
        traits: HazardTraitsSource;
    };

    interface HazardAttributesSource extends ActorAttributesSource {
        ac: { value: number };
        hp: {
            value: number;
            max: number;
            temp: number;
            details: string;
        };
        hardness: number;
        stealth: {
            value: number | null;
            details: string;
        };
        emitsSound: boolean | "encounter";
    }

    interface HazardDetailsSource extends ActorDetailsSource {
        isComplex: boolean;
        level: { value: number };
        disable?: string;
        description?: string;
        reset?: string;
        routine?: string;
        publication: PublicationData;

        readonly alliance?: never;
    }

    interface HazardSystemData
        extends Omit<HazardSystemSource, "attributes" | "details">,
            Omit<ActorSystemData, "traits"> {
        actions: NPCStrike[];
        attributes: HazardAttributes;
        details: HazardDetails;
        initiative?: InitiativeTraceData;
        traits: HazardTraitsData;
    }

    type HazardTrait = string;

    interface HazardTraitsSource extends ActorTraitsSource<HazardTrait> {
        size: { value: Size };
        rarity: Rarity;
        languages?: never;
    }

    interface HazardTraitsData extends HazardTraitsSource {
        size: ActorSizePF2e;
        rarity: Rarity;
    }

    interface HazardAttributes
        extends Omit<
                HazardAttributesSource,
                "initiative" | "immunities" | "weaknesses" | "resistances"
            >,
            Omit<ActorAttributes, "perception" | "shield"> {
        ac: {
            value: number;
        };
        hasHealth: boolean;
        hp: HazardHitPoints;
        hardness: number;
        stealth: HazardStealthTraceData;
        emitsSound: boolean | "encounter";
        shield?: never;
    }

    interface HazardStealthTraceData
        extends Omit<StatisticTraceData, "dc" | "totalModifier" | "value"> {
        dc: number | null;
        totalModifier: number | null;
        value: number | null;
        details: string;
    }

    interface HazardDetails extends Omit<HazardDetailsSource, "alliance">, ActorDetails {
        alliance: null;
    }

    interface HazardHitPoints extends ActorHitPoints {
        brokenThreshold: number;
    }

    type HazardSaveData = Omit<SaveData, "attribute">;
    type HazardSaves = Record<SaveType, HazardSaveData>;

    class HazardPF2e extends ActorPF2e {}

    interface HazardPF2e {
        readonly _source: HazardSource;
        system: HazardSystemData;

        saves: { [K in SaveType]?: Statistic };
    }
}

export type {};
