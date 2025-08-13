import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Historic } from "models/historic.model";
import { Repository } from "typeorm";

@Injectable()
export class HistoricHelper {
    constructor(@InjectRepository(Historic) private readonly _historicRepo: Repository<Historic>) { }


    async deleteExtraHistorics(userId: number) {
        const historicToClear = await this.getUserExtraHistorics(userId)
        if (!historicToClear)
            return



        for (let historic of historicToClear) {
            await this._historicRepo.delete(historic.id)

        }
    }


    async getUserExtraHistorics(userId: number) {
        const historics = await this._historicRepo.find({
            where: { user: { id: userId } },
            order: { id: "desc" },
            skip: 10,
        })

        if (historics == null || historics.length == 0)
            return false

        return historics
    }
}
