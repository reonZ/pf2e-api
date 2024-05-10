declare function renderActorSheets(types?: ActorSheetType | ActorSheetType[]): void;
declare function renderCharacterSheets(): void;
declare function renderItemSheets(types?: ItemSheetType | ItemSheetType[]): void;
type ActorSheetType = "ActorSheetPF2e" | "CharacterSheetPF2e" | "CreatureSheetPF2e" | "NPCSheetPF2e";
type ItemSheetType = "AbilitySheetPF2e" | "FeatSheetPF2e" | "ItemSheetPF2e" | "LootSheetPF2e";
export { renderActorSheets, renderCharacterSheets, renderItemSheets };
