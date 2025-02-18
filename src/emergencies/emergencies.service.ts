import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { UpdateEmergencyDto } from './dto/update-emergency.dto';
import { UserType, Status } from '@prisma/client';

@Injectable()
export class EmergenciesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createEmergencyDto: CreateEmergencyDto,
    requesterId: string,
  ) {
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
    });

    if (!requester || requester.type !== UserType.REQUESTER) {
      throw new ForbiddenException('Only requesters can create emergencies');
    }

    const emergency = await this.prisma.emergency.create({
      data: {
        ...createEmergencyDto,
        status: Status.CREATED,
        requesterId,
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        attendant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return emergency;
  }

  async findAll(
    userId: string,
    userType: UserType,
  ) {
    const where =
      userType === UserType.REQUESTER
        ? { requesterId: userId }
        : {
            OR: [{ status: Status.CREATED }, { attendantId: userId }],
          };

    return this.prisma.emergency.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        attendant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const emergency = await this.prisma.emergency.findUnique({
      where: { id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        attendant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!emergency) {
      throw new NotFoundException('Emergency not found');
    }

    return emergency;
  }

  async update(
    id: string,
    updateEmergencyDto: UpdateEmergencyDto,
    userId: string,
    userType: UserType,
  ) {
    const emergency = await this.findOne(id);

    if (userType === UserType.REQUESTER) {
      throw new ForbiddenException('Requesters cannot update emergencies');
    }

    if (emergency.status === Status.FINISHED) {
      throw new BadRequestException('Cannot update finished emergencies');
    }

    if (
      emergency.status === Status.ACTIVE &&
      emergency.attendant?.id !== userId
    ) {
      throw new ForbiddenException(
        'Only the assigned attendant can update this emergency',
      );
    }

    if (
      updateEmergencyDto.status === Status.ACTIVE &&
      emergency.status === Status.CREATED
    ) {
      updateEmergencyDto['attendantId'] = userId;
    }

    return this.prisma.emergency.update({
      where: { id },
      data: updateEmergencyDto,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        attendant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getStatistics(userType: UserType, userId: string) {
    const where =
      userType === UserType.REQUESTER ? { requesterId: userId } : {};

    const [total, active, finished] = await Promise.all([
      this.prisma.emergency.count({ where }),
      this.prisma.emergency.count({
        where: {
          ...where,
          status: Status.ACTIVE,
        },
      }),
      this.prisma.emergency.count({
        where: {
          ...where,
          status: Status.FINISHED,
        },
      }),
    ]);

    return {
      total,
      active,
      finished,
      created: total - active - finished,
    };
  }
}
