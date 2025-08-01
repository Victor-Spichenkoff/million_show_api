import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Optional,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../../../decorators/roles.decorator";
import {pageSize} from "../../../global";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionService.create(createQuestionDto);
  }

  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'isEn', required: false, type: Boolean, example: true })
  @ApiQuery({ name: 'skip', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'q', required: false, type: String, example: "" })
  @Get()
  async findPaged(
    @Query("page") page: number = 0,
    @Query("isEn") @Optional() isEn: string="true",
    @Query("skip") @Optional() skip: number = pageSize,
    @Query("q") @Optional() q: string = ""
  ) {
    return await this.questionService.findPaged(page, isEn=="true", skip,  q);
  }

  @Get("all")
  async findAll() {
    return await this.questionService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return await this.questionService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateQuestionDto: UpdateQuestionDto) {
    const res = await this.questionService.update(id, updateQuestionDto);
    if (Number(res.affected) > 0)
      return "Updated"

    return "Error updating question"
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("adm")
  @Delete(':id')
  async remove(@Param('id') id: number) {
   return "DELETED AKE"
    //TODO: UNCOMMENT
    // const res = await this.questionService.remove(id)
    // if (Number(res.affected) > 0)
    //   return "Deleted " + id
    //
    // throw new BadRequestException("Question doesn't exist")
  }
}
