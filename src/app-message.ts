

export enum AppMessageType {
    GetGenreWordConversionMap,
}

export interface AppMessage {
    type: AppMessageType;
}

export class AppMessageGetGenreWordConversionMap implements AppMessage {
    type: AppMessageType = AppMessageType.GetGenreWordConversionMap;
}