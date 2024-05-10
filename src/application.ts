import { isInstanceOf } from "foundry-api";

function renderApplication(type: string | string[]) {
    const types = Array.isArray(type) ? type : [type];

    const apps = Object.values(ui.windows).filter((app): app is Application =>
        types.some((x) => isInstanceOf(app, x))
    );

    for (const app of apps) {
        app.render();
    }
}

function renderActorSheets(type: ActorSheetType | ActorSheetType[] = ["ActorSheetPF2e"]) {
    renderApplication(type);
}

function renderCharacterSheets() {
    renderActorSheets(["CharacterSheetPF2e"]);
}

function renderItemSheets(type: ItemSheetType | ItemSheetType[] = ["ItemSheetPF2e"]) {
    renderApplication(type);
}

type ActorSheetType =
    | "ActorSheetPF2e"
    | "CharacterSheetPF2e"
    | "CreatureSheetPF2e"
    | "NPCSheetPF2e";

type ItemSheetType = "AbilitySheetPF2e" | "FeatSheetPF2e" | "ItemSheetPF2e" | "LootSheetPF2e";

export { renderActorSheets, renderCharacterSheets, renderItemSheets };
