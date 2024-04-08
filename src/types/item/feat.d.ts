declare global {
    type FeatCategory = FeatOrFeatureCategory;

    type FeatOrFeatureCategory =
        | "curse"
        | "class"
        | "general"
        | "skill"
        | "ancestry"
        | "bonus"
        | "ancestryfeature"
        | "classfeature"
        | "deityboon"
        | "pfsboon";

    interface PrerequisiteTagData {
        value: string;
    }

    interface SelfEffectReferenceSource {
        uuid: ItemUUID;
        name: string;
    }

    interface FeatTraitsSource extends ItemTraits {
        toggles?: { mindshift?: { selected?: boolean } | null };
    }

    interface FeatTraits extends FeatTraitsSource {
        toggles: any;
    }

    interface FeatLevelSource {
        value: number;
        taken?: number | null;
    }

    type ItemUUID = string;

    interface FeatSystemSource extends ItemSystemSource {
        level: FeatLevelSource;
        traits: FeatTraitsSource;
        category: FeatCategory;
        onlyLevel1: boolean;
        maxTakable: number | null;
        actionType: {
            value: ActionType;
        };
        actions: {
            value: OneToThree | null;
        };
        prerequisites: {
            value: PrerequisiteTagData[];
        };
        location: string | null;
        frequency?: FrequencySource;
        selfEffect?: SelfEffectReferenceSource | null;
    }

    interface SelfEffectReference extends SelfEffectReferenceSource {
        img?: string;
    }

    interface FeatSystemData
        extends Omit<FeatSystemSource, "description" | "maxTaken">,
            ItemSystemData {
        level: Required<FeatLevelSource>;
        traits: FeatTraits;
        maxTakable: number;
        frequency?: Frequency;
        selfEffect: SelfEffectReference | null;
    }

    type FeatSource = BaseItemSourcePF2e<"feat", FeatSystemSource>;

    class FeatPF2e<TParent extends ActorPF2e = ActorPF2e> extends ItemPF2e<TParent> {
        get rarity(): Rarity;
        get category(): FeatOrFeatureCategory;
    }

    interface FeatPF2e {
        readonly _source: FeatSource;
        system: FeatSystemData;
    }
}

export type {};
