import path from "path";
import { DayChangeHourUtc } from "./consts";

export const getWeekday = () => {
    const date = new Date();
    const hour = date.getUTCHours();
    let day = date.getUTCDay();
    if (hour >= DayChangeHourUtc) day++;
    if (day === 7) day = 0;
    return day;
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

export const getNextFinnishDayShort = (weekDay: number) => {
    const nextDay = {
        0: "su",
        1: "ma",
        2: "ti",
        3: "ke",
        4: "to",
        5: "pe",
        6: "la",
    }[weekDay];

    return nextDay;
};

export const getNextEnglishDayShort = (weekDay: number) => {
    const nextDay = {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
    }[weekDay];

    return nextDay;
};

export const pathToPNG = (imageName: string) =>
    path.join(process.cwd(), `${imageName}.png`);

export const getCurrentWeekNumber = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor(
        (currentDate.getUTCMilliseconds() - startDate.getUTCMilliseconds()) /
            (24 * 60 * 60 * 1000)
    );

    const weekNumber = Math.ceil(days / 7);

    // Display the calculated result
    console.log("Week number of " + currentDate + " is :   " + weekNumber);
    return weekNumber;
};
