import { isInstanceOf } from "foundry-api";

function renderCharacterSheets() {
    const apps = Object.values(ui.windows).filter((app): app is CharacterSheetPF2e =>
        isInstanceOf<CharacterSheetPF2e>(app, "CharacterSheetPF2e")
    );

    for (const app of apps) {
        app.render();
    }
}

export { renderCharacterSheets };
