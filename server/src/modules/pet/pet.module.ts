import { Module } from "@nestjs/common";
import { PetService } from "./pet.service";
import { PetController } from "./pet.controller";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { PetModel } from "./pet.model";
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    MongooseModule.forFeature([
      { name: "Pet", schema: PetModel, collection: "Pet" },
    ]),
  ],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}
