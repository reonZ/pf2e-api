declare function transferItemToActor(targetActor: ActorPF2e, item: ItemPF2e<ActorPF2e>, quantity: number, containerId?: string, newStack?: boolean): Promise<PhysicalItemPF2e<ActorPF2e> | null>;
declare function resetActors(actors?: Iterable<ActorPF2e>, options?: ResetActorsRenderOptions): Promise<void>;
interface ResetActorsRenderOptions {
    sheets?: boolean;
    tokens?: boolean;
}
export { resetActors, transferItemToActor };
