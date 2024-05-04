import { createHTMLElement } from "./utils";

class RollNotePF2e {
    selector: string;
    title: string | null;
    text: string;
    predicate: Predicate;
    outcome: DegreeOfSuccessString[];
    visibility: UserVisibility | null;
    rule: RuleElementPF2e | null;

    constructor(params: RollNoteParams) {
        this.selector = params.selector;
        this.title = params.title ?? null;
        this.text = params.text;
        this.predicate = new game.pf2e.Predicate(params.predicate ?? []);
        this.outcome = [...(params.outcome ?? [])];
        this.visibility = params.visibility ?? null;
        this.rule = params.rule ?? null;
    }

    static notesToHTML(notes: RollNotePF2e[]): HTMLUListElement | null {
        if (notes.length === 0) return null;
        return createHTMLElement("ul", {
            classes: ["notes"],
            children: [...notes.flatMap((n) => ["\n", n.toHTML()]), "\n"],
        });
    }

    toHTML(): HTMLLIElement {
        const element = createHTMLElement("li", {
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
            const strong = createHTMLElement("strong", {
                innerHTML: game.i18n.localize(this.title),
            });
            element.prepend(strong, " ");
        }

        return element;
    }

    clone(): RollNotePF2e {
        return new RollNotePF2e({ ...this.toObject(), rule: this.rule });
    }

    toObject(): RollNoteSource {
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

export { RollNotePF2e };
