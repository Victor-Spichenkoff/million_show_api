import { Match } from '../models/match.model';
import { Historic } from '../models/historic.model';
import { prizes } from './matchHepers';
import { BadRequestException } from '@nestjs/common';
import {Point} from "../models/points.model";
import {User} from "../models/user.model";



export const getPointsInfo = (match: Match, finalPrize: number) => {
  const now = Number(new Date())
  const points = getMatchPoints(match, finalPrize, now)
  return {
    points,
    duration: getDurationInMinutes(match.startDate, now)
  }
}

export const getMatchPoints = (match: Match, finalPrize: number, now: number) => {
  let final = 0;

  if(match.questionIndex > 3)
    final += getHintPoints(match);
  final += getPointsByCorrectsWithFinalPrize(finalPrize)
  if(match.state == "won")
    final += getPointsByTime(match.startDate, now)

  return final
}


/*
 * 0 - 225
 * */
export const getHintPoints = (match: Match) => {
  let final = 0;

  final += match.skips * 50;
  final += match.skips * 75;
  final += match.skips * 25;

  return final;
};


/*
* 0 - 1500
* */
export const getPointsByCorrectsWithFinalPrize = (finalPrize: number) => {
  if (finalPrize == 1_000_000) return 1500;

  if (!prizes.includes(finalPrize))
    throw new BadRequestException('Incorrect prize value!');

  let final = 0;
  for (let prize of prizes) {
    if (prize <= finalPrize) final += prize / 1_000;
  }

  if (final - finalPrize / 10_000 < 1) return Math.round(final);

  if (finalPrize - finalPrize / 10_000 < 500)
    return Math.round(final - finalPrize / 10_000);
  return Math.round((final - finalPrize / 10_000) / 2);
}


const getPointsByTime = (startTimeMs: number, endTimeMs: number) => {
  const diff = getDurationInMinutes(startTimeMs, endTimeMs)

  return Math.round(Math.max(450 - diff * 15, 0))
}

const getDurationInMinutes = (startMs: number, endMs: number) => {
  return (endMs - startMs) / 1000 / 60
}


// TEST AREA

const savePointsToPlayer = (playerId: number, match: Match, finalPrize: number) => {
  const point = new Point();
  //pegar pontos
  const pointInfo = getPointsInfo(match, finalPrize);
  point.points = pointInfo.points;
  point.totalTime = pointInfo.duration;
  //dicas
  point.skipsUsed = 2 - match.skips;
  point.univerUsed = 2 - match.universitary;
  point.halfUsed = 1 - match.halfHalf;

  point.corrects =
      match.questionState == 'answered'
          ? match.questionIndex
          : Math.max(match.questionIndex - 1, 0)

  const user = new User();
  user.id = playerId;
  point.user = user;

  return point;
}

const match: Match = {
  "id": 22,
  "state": "playing",
  "hintState": "none",
  "skips": 2,
  "halfHalf": 1,
  "universitary": 2,
  "questionIndex": 0,
  // "startDate":  Number(new Date("2025-04-09T14:24:41.000Z")),
  "startDate": Number(new Date("2025-04-18T00:29:41.000Z")),
  "wrongPrize": 0,
  "stopPrize": 0,
  "nextPrize": 1000,
  "questionState": "waiting",
  historic: new Historic()
}
// const = match: Match = {
//   "id": 20,
//   "state": "playing",
//   "hintState": "none",
//   "skips": 2,
//   "halfHalf": 1,
//   "universitary": 2,
//   "questionIndex": 1,
//   "startDate": Number(new Date("2025-04-09T14:24:41.000Z")),
//   "wrongPrize": 0,
//   "stopPrize": 0,
//   "nextPrize": 1000,
//   "questionState": "answered",
//   historic: new Historic()
// }


// for (let f of [...prizes, 1_000_000]) {
//   console.log(`${f} -> ` + getTriangularWithPrizes(f));
// }
