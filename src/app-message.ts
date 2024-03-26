
export enum AppMessageType {
    ClickContextMenu,
}

export interface AppMessage {
    type: AppMessageType;
}

export class AppMessageClickContextMenu implements AppMessage {
    type: AppMessageType = AppMessageType.ClickContextMenu;
};