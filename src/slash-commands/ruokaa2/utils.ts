import path from "path";
import { getConfig } from "../ruokaa-config";
import { DayChangeHourUtc } from "./consts";

export const getWeekday = () => {
    const date = new Date();
    const hour = date.getUTCHours();
    let day = date.getUTCDay();
    if (hour >= DayChangeHourUtc) day++;
    if (day === 7) day = 0;
    return day;
};

export const getWeekdayConfig = async () => {
    const weekday = getWeekday();
    const config = await getConfig();
    const foods = config[weekday];
    return foods;
};

export const getNextFinnishDay = (weekDay: number) => {
    const nextDay = {
        0: "Maanantai", // On sunday, give next monday's list
        1: "Maanantai",
        2: "Tiistai",
        3: "Keskiviikko",
        4: "Torstai",
        5: "Perjantai",
        6: "Lauantai",
    }[weekDay];

    return nextDay;
};

export const pathToPNG = (imageName: string) =>
    path.join(process.cwd(), `${imageName}.png`);
