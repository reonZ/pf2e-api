import { isInstanceOf } from "foundry-api";

function renderApplication(types: string | string[]) {
    types = Array.isArray(types) ? types : [types];

    const apps = Object.values(ui.windows).filter((app): app is Application =>
        types.some((type) => isInstanceOf(app, type))
    );

    for (const app of apps) {
        app.render();
    }
}

function renderActorSheets(types: ActorSheetType | ActorSheetType[] = ["ActorSheetPF2e"]) {
    renderApplication(types);
}

function renderCharacterSheets() {
    renderActorSheets(["CharacterSheetPF2e"]);
}

function renderItemSheets(types: ItemSheetType | ItemSheetType[] = ["ItemSheetPF2e"]) {
    renderApplication(types);
}

type ActorSheetType =
    | "ActorSheetPF2e"
    | "CharacterSheetPF2e"
    | "CreatureSheetPF2e"
    | "NPCSheetPF2e";

type ItemSheetType = "AbilitySheetPF2e" | "FeatSheetPF2e" | "ItemSheetPF2e" | "LootSheetPF2e";

export { renderActorSheets, renderCharacterSheets, renderItemSheets };
