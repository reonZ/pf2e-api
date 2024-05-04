import { R } from "foundry-api";
import { ErrorPF2e } from "./utils";

async function transferItemToActor(
    targetActor: ActorPF2e,
    item: ItemPF2e<ActorPF2e>,
    quantity: number,
    containerId?: string,
    newStack = false
): Promise<PhysicalItemPF2e<ActorPF2e> | null> {
    if (!item.isOfType("physical")) {
        throw ErrorPF2e("Only physical items (with quantities) can be transfered between actors");
    }

    const container = targetActor.inventory.get(containerId ?? "");
    if (container && !container?.isOfType("backpack")) {
        throw ErrorPF2e("containerId refers to a non-container");
    }

    quantity = Math.min(quantity, item.quantity);

    const newQuantity = item.quantity - quantity;
    const removeFromSource = newQuantity < 1;

    if (removeFromSource) {
        await item.delete();
    } else {
        await item.update({ "system.quantity": newQuantity });
    }

    const newItemData = item.toObject();
    newItemData.system.quantity = quantity;
    newItemData.system.equipped.carryType = "worn";
    if ("invested" in newItemData.system.equipped) {
        newItemData.system.equipped.invested = item.traits.has("invested") ? false : null;
    }

    return targetActor.addToInventory(newItemData, container, newStack);
}

async function resetActors(
    actors?: Iterable<ActorPF2e>,
    options: ResetActorsRenderOptions = {}
): Promise<void> {
    actors ??= [
        game.actors.contents as ActorPF2e[],
        game.scenes.contents
            .flatMap((s) => s.tokens.contents as TokenDocumentPF2e[])
            .flatMap((t) => t.actor ?? []),
    ].flat();
    actors = R.uniq(Array.from(actors));
    options.sheets ??= true;

    for (const actor of actors) {
        actor.reset();
        if (options.sheets) actor.render();
    }
    game.pf2e.effectPanel.refresh();

    const refreshScenes =
        game.settings.get("pf2e", "automation.effectExpiration") &&
        !game.settings.get("pf2e", "automation.removeExpiredEffects");

    if (refreshScenes) {
        const scenes = R.uniq(
            Array.from(actors)
                .flatMap((a) => a.getActiveTokens(false, true))
                .flatMap((t) => t.scene)
        );
        for (const scene of scenes) {
            scene.reset();
            if (scene.isView) {
                canvas.perception.update({ initializeVision: true }, true);
            }
        }
    }

    if (options.tokens) {
        for (const token of R.uniq(
            Array.from(actors).flatMap((a) => a.getActiveTokens(true, true))
        )) {
            token.simulateUpdate();
        }
    }
}

interface ResetActorsRenderOptions {
    sheets?: boolean;
    tokens?: boolean;
}

export { resetActors, transferItemToActor };
