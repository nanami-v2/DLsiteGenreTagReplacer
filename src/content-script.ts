
import { ContentScriptActionFactory } from "./content-script-action-factory";

/*
    各ページでやることが微妙に異なるので、actionそれ自体をクラス化して対処
*/
const actionFactory = new ContentScriptActionFactory();
const action        = actionFactory.createContentScriptAction(window.location.toString());

action.setup();
action.excute();