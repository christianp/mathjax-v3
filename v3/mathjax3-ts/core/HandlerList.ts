import {PrioritizedList, PrioritizedListItem} from "../util/PrioritizedList.js";
import {OptionList} from "../util/Options.js";
import {Handler} from "./Handler.js";
import {MathDocument} from "./MathDocument.js";

export class HandlerList extends PrioritizedList<Handler>  {

    Register(handler: Handler) {
        return this.Add(handler, handler.priority);
    }

    UnRegister(handler: Handler) {
        this.Remove(handler);
    }

    HandlesDocument(document: any) {
        for (const item of this.toArray()) {
            let handler = item.item;
            if (handler.HandlesDocument(document)) return handler;
        }
        throw new Error("Can't find handler for document");
    }

    Document(document: any, options: OptionList = null) {
        return this.HandlesDocument(document).Create(document,options);
    }

};