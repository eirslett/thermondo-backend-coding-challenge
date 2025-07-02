import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { RatingService } from "./rating.service";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";
import { AuthGuard, AuthenticatedRequest } from "../auth/auth.guard";

@Controller("rating")
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async create(
    @Body() createRatingDto: CreateRatingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user) throw new UnauthorizedException("User not authenticated");
    return this.ratingService.create(createRatingDto, req.user.id);
  }

  @Get()
  findAll() {
    // TODO: Add pagination, sorting, filtering, etc.
    // Or maybe we don't really need this endpoint?
    return this.ratingService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ratingService.findOne(+id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user) throw new UnauthorizedException("User not authenticated");
    return this.ratingService.update(+id, updateRatingDto, req.user.id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
    if (!req.user) throw new UnauthorizedException("User not authenticated");
    return this.ratingService.remove(+id, req.user.id);
  }
}
