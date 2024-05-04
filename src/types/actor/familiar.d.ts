declare global {
    type FamiliarSource = BaseCreatureSource<"familiar", FamiliarSystemSource>;

    interface FamiliarDetailsSource extends CreatureDetailsSource {
        creature: {
            value: string;
        };
        alliance?: never;
        languages?: never;
        level?: never;
    }

    interface FamiliarAttributesSource {
        hp: { value: number; temp: number };
        immunities?: never;
        weaknesses?: never;
        resistances?: never;
    }

    interface FamiliarSystemSource extends CreatureSystemSource {
        details: FamiliarDetailsSource;
        attributes: FamiliarAttributesSource;
        master: {
            id: string | null;
            ability: AttributeString | null;
        };

        customModifiers?: never;
        perception?: never;
        resources?: never;
        saves?: never;
        skills?: never;
        traits?: never;
    }

    interface FamiliarDetails extends CreatureDetails {
        creature: {
            value: string;
        };
    }

    interface FamiliarSystemData
        extends Omit<
                FamiliarSystemSource,
                | "attributes"
                | "customModifiers"
                | "details"
                | "perception"
                | "toggles"
                | "resources"
                | "saves"
                | "skills"
                | "traits"
            >,
            CreatureSystemData {
        details: FamiliarDetails;
        attack: StatisticTraceData;
        attributes: CreatureAttributes;
        master: {
            id: string | null;
            ability: AttributeString | null;
        };

        actions?: never;
        initiative?: never;
    }

    class FamiliarPF2e extends CreaturePF2e {
        get master(): CharacterPF2e | null;
    }

    interface FamiliarPF2e {
        readonly _source: FamiliarSource;
        system: FamiliarSystemData;
    }
}

export type {};
