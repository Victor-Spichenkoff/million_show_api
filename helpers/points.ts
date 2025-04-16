import { Match } from '../models/match.model';
import { Historic } from '../models/historic.model';
import { prizes } from './matchHepers';
import { BadRequestException } from '@nestjs/common';



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

  final += getHintPoints(match);
  final += getPointsByCorrectsWithFinalPrize(finalPrize)


  return final;
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

  return Math.round(Math.max(225 - diff * 7.5, 0))
}

const getDurationInMinutes = (startMs: number, endMs: number) => {
  return (endMs - startMs) / 1000 / 60
}

const start = Number(new Date()) - Number(new Date(1_000 * 60 * 15))//Tue Apr 15 2025 22:04:07 GMT-0300
console.log(new Date(start).toString())
console.log(getPointsByTime(start, Number(new Date())))

// for (let f of [...prizes, 1_000_000]) {
//   console.log(`${f} -> ` + getTriangularWithPrizes(f));
// }
