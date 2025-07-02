import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRatingDto: CreateRatingDto, userId: number) {
    return this.prisma.rating.create({
      data: {
        ...createRatingDto,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.rating.findMany();
  }

  async findOne(id: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException("Rating not found");
    return rating;
  }

  async update(id: number, updateRatingDto: UpdateRatingDto, userId: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException("Rating not found");
    if (rating.userId !== userId) throw new ForbiddenException("Not allowed");
    return this.prisma.rating.update({
      where: { id },
      data: updateRatingDto,
    });
  }

  async remove(id: number, userId: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException("Rating not found");
    if (rating.userId !== userId) throw new ForbiddenException("Not allowed");
    return this.prisma.rating.delete({ where: { id } });
  }

  async findAllByUserId(userId: number) {
    return this.prisma.rating.findMany({ where: { userId } });
  }

  async findAllByMovieId(movieId: number) {
    return this.prisma.rating.findMany({ where: { movieId } });
  }
}
