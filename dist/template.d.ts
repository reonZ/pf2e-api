/**
 * @param {unknown} measuredTemplate
 * @param {{collisionOrigin?: {x: number, y: number}, collisionType?: "move" | "sight"}} [options]
 * @returns {unknown[]}
 */
declare function getTemplateTokens(measuredTemplate: MeasuredTemplateDocument | MeasuredTemplate, { collisionOrigin, collisionType, }?: {
    collisionOrigin?: PIXI.Point;
    collisionType?: "move";
}): TokenPF2e<ActorPF2e>[];
export { getTemplateTokens };
