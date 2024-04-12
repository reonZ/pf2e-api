declare global {
    type PartySource = BaseActorSourcePF2e<"party", PartySystemSource>;

    interface PartySystemSource extends ActorSystemSource {
        attributes: PartyAttributesSource;
        details: PartyDetailsSource;
        traits?: never;
        campaign?: PartyCampaignSource;
    }

    interface PartyAttributesSource extends ActorAttributesSource {
        hp?: never;
        ac?: never;
        immunities?: never;
        weaknesses?: never;
        resistances?: never;
    }

    interface PartyDetailsSource extends ActorDetailsSource {
        description: string;
        members: MemberData[];
        readonly alliance?: never;
        readonly level?: never;
    }

    interface MemberData {
        uuid: ActorUUID;
    }

    interface ActorUpdateContext extends DocumentUpdateContext {
        damageTaken?: number;
        finePowder?: boolean;
        damageUndo?: boolean;
    }

    interface PartyUpdateContext extends ActorUpdateContext {
        removedMembers?: string[];
    }

    /** Interface for a party campaign implementation, alternative data preparation used by parties for special campaigns */
    interface PartyCampaign extends FoundryDocument {
        type: string;
        level?: number;
        extraItemTypes?: ItemType[];
        createSidebarButtons?(): HTMLElement[];
        getStatistic?(slug: string): Statistic | null;
        getRollOptions?(): string[];
        getRollData?(): Record<string, unknown>;
        renderSheet?(options?: { tab?: string; type?: string | null }): void;
        _preUpdate?(changed: Record<string, unknown>): void;
    }

    interface PartySystemData
        extends Omit<PartySystemSource, "attributes" | "campaign" | "details">,
            Omit<ActorSystemData, "traits"> {
        attributes: PartyAttributes;
        details: PartyDetails;
        campaign: PartyCampaign;
    }

    interface PartyAttributes
        extends Omit<PartyAttributesSource, "immunities" | "weaknesses" | "resistances">,
            Omit<ActorAttributes, "initiative" | "ac" | "hp"> {
        immunities: never[];
        weaknesses: never[];
        resistances: never[];
        speed: { total: number };
    }

    interface PartyDetails extends Omit<PartyDetailsSource, "alliance" | "level">, ActorDetails {
        level: { value: number };
    }

    type PartyCampaignSource = { type: string } & Record<string, JSONValue>;

    class PartyPF2e extends ActorPF2e {
        members: CreaturePF2e[];
    }

    interface PartyPF2e {
        readonly _source: PartySource;
        system: PartySystemData;
    }
}

export type {};
