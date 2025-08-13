import { Historic } from 'models/historic.model';
import { Match } from 'models/match.model';
import { User } from 'models/user.model';

export const giveInitialHistoric = (match: Match, user: User): Historic => ({
  match,
  questions: [],
  user,
  finalPrize: 0,
  finalState: undefined,
  finishDate: 0,
  id: 0,
  historicQuestions: [],
  points:0,
})
