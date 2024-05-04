declare function extractEphemeralEffects({ affects, origin, target, item, domains, options, }: ExtractEphemeralEffectsParams): Promise<(ConditionSource | EffectSource)[]>;
interface ExtractEphemeralEffectsParams {
    affects: "target" | "origin";
    origin: ActorPF2e | null;
    target: ActorPF2e | null;
    item: ItemPF2e | null;
    domains: string[];
    options: Set<string> | string[];
}
export { extractEphemeralEffects };
