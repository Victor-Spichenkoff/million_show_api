import { Match } from "models/match.model";

export const isAlreadyStarted = (matchs: Match[]): false | Match[] => {
    if(!matchs || matchs.length == 0)
        return false

    const alreadystarted = matchs.filter((m) => m.state == "playing")

    return alreadystarted.length > 0 && alreadystarted
}