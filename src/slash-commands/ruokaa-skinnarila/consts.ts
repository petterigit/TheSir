import { pathToPNG } from "../../utils/ruokaa-utils/generalUtils";

export const DayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

export const DayChangeHourUtc = 12;

export const ssNames = {
    laser: {
        filename: "laser-ruokalista.png",
        fileLoc: pathToPNG("laser-ruokalista"),
        title: "Laseri",
    },
    yolo: {
        filename: "yolo-ruokalista.png",
        fileLoc: pathToPNG("yolo-ruokalista"),
        title: "YOLO",
    },
    lutBuffet: {
        filename: "lut-buffet.png",
        fileLoc: pathToPNG("lut-buffet"),
        title: "LUT-Buffet",
    },
};
