import { Controller } from '@nestjs/common';
import { HistoricQuestionService } from './historic-question.service';

@Controller('historic-question')
export class HistoricQuestionController {
  constructor(private readonly historicQuestionService: HistoricQuestionService) {}
}
