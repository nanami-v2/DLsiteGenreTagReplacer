
import { BackgroundScriptData } from './background-script-data';
import { BackgroundScriptAction } from "./background-script-action";

const data   = new BackgroundScriptData();
const action = new BackgroundScriptAction();

action.setup(data);
action.execute(data);