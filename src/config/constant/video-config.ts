import {IScaleOptions, ISettingOption} from "@interfaces/video-config";

const ScaleOptions: Readonly<IScaleOptions> = {
    "360p": "360p",
    "720p": "720p",
    "1080p": "1080p"
}

const ScaleSetting: Readonly<ISettingOption[]> = [
    {name: "1080p", value: "1080p"},
    {name: "720p", value: "720p"},
    {name: "360p", value: "360p"}
]

const PlaybackSetting: Readonly<ISettingOption[]> = [
    {name: "0.5x", value: 0.5},
    {name: "0.75x", value: 0.75},
    {name: "normal", value: 1},
    {name: "1.25x", value: 1.25},
    {name: "1.75x", value: 1.50},
    {name: "2x", value: 2}
]

export {ScaleOptions, ScaleSetting, PlaybackSetting}