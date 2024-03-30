
import { ContentScriptActionFactory } from "./content-script-action-factory";

const actionFactory = new ContentScriptActionFactory();
const action        = actionFactory.createContentScriptAction(window.location.toString());

if (action) {
    action.setup();
    action.excute();
}