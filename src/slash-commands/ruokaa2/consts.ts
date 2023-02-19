import { pathToFile } from "./utils";

export const Restaurant = {
    yolo: "Yolo",
    laseri: "Laser",
    lutBuffet: "LUT Buffet",
    keskusta: "Keskusta",
};

export const RestaurantButtons = {
    ...Restaurant,
    skip: "Skip",
};

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

export type FoodConfig = Record<number, string[]>;

export const ConfigFileName = "ruokaa.json";

export const DefaultFoodConfig: FoodConfig = {
    [DayMap.Monday]: [Restaurant.yolo, Restaurant.laseri, Restaurant.lutBuffet],
    [DayMap.Tuesday]: [
        Restaurant.yolo,
        Restaurant.laseri,
        Restaurant.lutBuffet,
    ],
    [DayMap.Wednesday]: [
        Restaurant.yolo,
        Restaurant.laseri,
        Restaurant.lutBuffet,
    ],
    [DayMap.Thursday]: [
        Restaurant.yolo,
        Restaurant.laseri,
        Restaurant.lutBuffet,
    ],
    [DayMap.Friday]: [Restaurant.yolo, Restaurant.laseri, Restaurant.lutBuffet],
    [DayMap.Saturday]: [
        Restaurant.yolo,
        Restaurant.laseri,
        Restaurant.lutBuffet,
    ],
    [DayMap.Sunday]: [Restaurant.yolo, Restaurant.laseri, Restaurant.lutBuffet],
};

export const ssNames = {
    laser: {
        filename: "laser-ruokalista.png",
        fileLoc: pathToFile("laser-ruokalista"),
        title: "Laseri",
    },
    yolo: {
        filename: "yolo-ruokalista.png",
        fileLoc: pathToFile("yolo-ruokalista"),
        title: "YOLO",
    },
};
