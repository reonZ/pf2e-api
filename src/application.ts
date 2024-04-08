import { isInstanceOf } from "foundry-api";

function renderCharacterSheet(actor?: CharacterPF2e) {
    const apps = Object.values(ui.windows).filter((app): app is CharacterSheetPF2e =>
        isInstanceOf<CharacterSheetPF2e>(app, "CharacterSheetPF2e")
    );

    if (actor) {
        const app = apps.find((x) => x.actor === actor);
        app?.render();
        return;
    }

    for (const app of apps) {
        app.render();
    }
}

export { renderCharacterSheet };
