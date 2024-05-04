"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollNotePF2e = void 0;
const utils_1 = require("./utils");
class RollNotePF2e {
    selector;
    title;
    text;
    predicate;
    outcome;
    visibility;
    rule;
    constructor(params) {
        this.selector = params.selector;
        this.title = params.title ?? null;
        this.text = params.text;
        this.predicate = new Predicate(params.predicate ?? []);
        this.outcome = [...(params.outcome ?? [])];
        this.visibility = params.visibility ?? null;
        this.rule = params.rule ?? null;
    }
    static notesToHTML(notes) {
        if (notes.length === 0)
            return null;
        return (0, utils_1.createHTMLElement)("ul", {
            classes: ["notes"],
            children: [...notes.flatMap((n) => ["\n", n.toHTML()]), "\n"],
        });
    }
    toHTML() {
        const element = (0, utils_1.createHTMLElement)("li", {
            classes: ["roll-note"],
            dataset: {
                itemId: this.rule?.item.id,
                visibility: this.visibility,
            },
            innerHTML: game.i18n.localize(this.text),
        });
        if (element.childNodes.length === 1 && element.firstChild instanceof HTMLElement) {
            element.innerHTML = element.firstChild.innerHTML;
        }
        if (this.title) {
            const strong = (0, utils_1.createHTMLElement)("strong", {
                innerHTML: game.i18n.localize(this.title),
            });
            element.prepend(strong, " ");
        }
        return element;
    }
    clone() {
        return new RollNotePF2e({ ...this.toObject(), rule: this.rule });
    }
    toObject() {
        return {
            selector: this.selector,
            title: this.title,
            text: this.text,
            predicate: this.predicate.toObject(),
            outcome: this.outcome,
            visibility: this.visibility,
        };
    }
}
exports.RollNotePF2e = RollNotePF2e;
