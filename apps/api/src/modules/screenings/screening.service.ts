import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ScoringEngine } from './engines/scoring.engine.js';
import { CreateScreeningDto } from './dto/create-screening.dto.js';
import { userRole } from '../../common/constants/roles.enum.js';
import { AuthUser } from '../../common/decorators/current-user.decorator.js';

@Injectable()
export class ScreeningsService {
  private readonly logger = new Logger(ScreeningsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scoring: ScoringEngine,
  ) {}

  async create(dto: CreateScreeningDto, currentUser: AuthUser) {
    // Verify the patient exists
    const patient = await this.prisma.individual.findUnique({
      where: { id: dto.individualId },
      include: { household: { select: { chwId: true } } },
    });

    if (!patient) {
      throw new NotFoundException(`Patient ${dto.individualId} not found`);
    }

    // Ownership check, CHWs can only screen their own patients
    if (
      currentUser.role === userRole.CHW &&
      patient.household.chwId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'You can only screen your own patients.',
      );
    }

    //Compute score + triage
    const { score, triage } = this.scoring.score(
      dto.screeningType,
      dto.responses,
    );

    //Save screening
    const screening = await this.prisma.screening.create({
      data: {
        individualId: dto.individualId,
        chwId: currentUser.id,
        screeningType: dto.screeningType,
        responses: dto.responses,
        score,
        triageLevel: triage,
        notes: dto.notes,
      },
    });

    this.logger.log(
      `Screening ${screening.id} (${dto.screeningType}) score=${score} triage=${triage}`,
    );

    return screening;
  }

  async findAll(currentUser: AuthUser, individualId?: string) {
    let where: any = {};

    if (individualId) {
      where.individualId = individualId;
    }

    // Role-based scoping
    switch (currentUser.role) {
      case userRole.ADMIN:
        break;

      case userRole.CHW:
        where.chwId = currentUser.id;
        break;

      case userRole.CHO:
      case userRole.SUPERVISOR: {
        const supervisedCHWs = await this.prisma.user.findMany({
          where: { supervisorId: currentUser.id },
          select: { id: true },
        });
        where.chwId = { in: supervisedCHWs.map((u) => u.id) };
        break;
      }

      case userRole.NURSE:
      case userRole.DOCTOR:
        
        break;

      default:
        throw new ForbiddenException('Role cannot access screenings.');
    }

    return this.prisma.screening.findMany({
      where,
      orderBy: { administeredAt: 'desc' },
      include: {
        individual: {
          select: { id: true, firstName: true, lastName: true },
        },
        chw: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findOne(id: string, currentUser: AuthUser) {
    const screening = await this.prisma.screening.findUnique({
      where: { id },
      include: {
        individual: true,
        chw: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    if (!screening) {
      throw new NotFoundException(`Screening ${id} not found`);
    }

    // Ownership check for CHW
    if (
      currentUser.role === userRole.CHW &&
      screening.chwId !== currentUser.id
    ) {
      throw new ForbiddenException('You can only view your own screenings.');
    }

    return screening;
  }
}