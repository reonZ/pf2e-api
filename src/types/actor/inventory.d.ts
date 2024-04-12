declare global {
    class InventoryBulk {}

    class ActorInventory<TActor extends ActorPF2e> extends DelegatedCollection<
        PhysicalItemPF2e<TActor>
    > {}
}

export type {};
