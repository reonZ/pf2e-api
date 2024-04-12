declare global {
    type ContainerSource = BasePhysicalItemSource<"backpack", ContainerSystemSource>;

    type ContainerTraits = PhysicalItemTraits<EquipmentTrait>;

    interface ContainerBulkSource {
        value: number;
        heldOrStowed: number;
        capacity: number;
        ignored: number;
    }

    interface ContainerBulkData extends ContainerBulkSource, BulkData {}

    interface ContainerSystemData
        extends Omit<
                ContainerSystemSource,
                | "apex"
                | "bulk"
                | "description"
                | "hp"
                | "identification"
                | "material"
                | "price"
                | "temporary"
                | "usage"
            >,
            Omit<Investable<PhysicalSystemData>, "subitems" | "traits"> {
        bulk: ContainerBulkData;
        stackGroup: null;
    }

    interface ContainerSystemSource extends Investable<PhysicalSystemSource> {
        traits: ContainerTraits;
        stowing: boolean;
        bulk: ContainerBulkSource;
        collapsed: boolean;
        usage: { value: string };
        subitems?: never;
    }

    class ContainerPF2e<TParent extends ActorPF2e = ActorPF2e> extends PhysicalItemPF2e<TParent> {
        get stowsItems(): boolean;
        get isCollapsed(): boolean;
        get capacity(): { value: Bulk; max: Bulk };
        get percentFull(): number;
        get bulkIgnored(): Bulk;
        get bulk(): Bulk;
    }

    interface ContainerPF2e<TParent extends ActorPF2e = ActorPF2e>
        extends PhysicalItemPF2e<TParent> {
        readonly _source: ContainerSource;
        system: ContainerSystemData;

        get traits(): Set<EquipmentTrait>;
    }
}

export type {};
