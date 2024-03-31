
import { ContentScriptActionFactory } from "./content-script-action-factory";

const actionFactory = new ContentScriptActionFactory();
const action        = actionFactory.createContentScriptAction(window.location.toString());

action.setup();
action.excute();