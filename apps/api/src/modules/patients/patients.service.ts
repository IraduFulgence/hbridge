import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';
import { userRole } from '../../common/constants/roles.enum.js';
import { AuthUser } from '../../common/decorators/current-user.decorator.js';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePatientDto, currentUser: AuthUser) {
    // Get or create the household for this CHW
    let household = await this.prisma.household.findFirst({
      where: { chwId: currentUser.id, 
        headId: dto.headId ?? null,},
    });
    // get or create the household for head of family and village if provided
  

    if (!household) {
      household = await this.prisma.household.create({
        data: {
          chwId: currentUser.id,
          village: dto.village ?? 'Unspecified',
          headName: dto.headName ?? `${dto.firstName} ${dto.lastName}`,
          headId: dto.headId ?? null,
         
        },
      });
    }

    const patient = await this.prisma.individual.create({
      data: {
        householdId: household.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        age: dto.age,
        phone: dto.phone,
        nationalId: dto.nationalId,
        address: dto.address,
        hasHypertension: dto.hasHypertension ?? false,
        hasDiabetes: dto.hasDiabetes ?? false,
      },
      include: {
        household: {
          select: { id: true, village: true, chwId: true },
        },
      },
    });

    this.logger.log(
      `Patient created: ${patient.id} by ${currentUser.role} ${currentUser.id}`,
    );

    return patient;
  }

  async findAll(currentUser: AuthUser) {
    // Role-based scoping
    let where: any = {};

    switch (currentUser.role) {
      case userRole.ADMIN:
        // Admin sees everything
        break;

      case userRole.CHW:
        // CHW sees only their own patients
        where = { household: { chwId: currentUser.id } };
        break;

      case userRole.CHO:
      case userRole.SUPERVISOR: {
        // CHO/SUPERVISOR see patients of their supervised CHWs
        const supervisedCHWs = await this.prisma.user.findMany({
          where: { supervisorId: currentUser.id },
          select: { id: true },
        });
        const chwIds = supervisedCHWs.map((u) => u.id);
        where = { household: { chwId: { in: chwIds } } };
        break;
      }

      case userRole.NURSE:
      case userRole.DOCTOR: {
        // Nurse/Doctor see patients in their district
        if (!currentUser.district) {
          throw new ForbiddenException(
            'Your account is not associated with a district.',
          );
        }
        where = {
          household: {
            chw: { district: currentUser.district },
          },
        };
        break;
      }

      default:
        throw new ForbiddenException('Role cannot access patients.');
    }

    return this.prisma.individual.findMany({
      where,
      include: {
        household: {
          select: {
            id: true,
            village: true,
            chw: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, currentUser: AuthUser) {
    const patient = await this.prisma.individual.findUnique({
      where: { id },
      include: {
        household: {
          select: { id: true, village: true, headName:true, chwId: true, chw: { select: { id: true, district: true } } },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(`Patient ${id} not found`);
    }

    // Ownership check
    this.assertCanAccess(patient, currentUser);

    return patient;
  }

  async update(
    id: string,
    dto: UpdatePatientDto,
    currentUser: AuthUser,
  ) {
    const patient = await this.prisma.individual.findUnique({
      where: { id },
      include: { household: { select: { chwId: true } } },
    });

    if (!patient) {
      throw new NotFoundException(`Patient ${id} not found`);
    }

    this.assertCanAccess(patient, currentUser);

    return this.prisma.individual.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        age: dto.age,
        phone: dto.phone,
        nationalId: dto.nationalId,
        address: dto.address,
        hasHypertension: dto.hasHypertension,
        hasDiabetes: dto.hasDiabetes,
      },
      include: {
        household: {
          select: { id: true, village: true, chwId: true },
        },
      },
    });
  }

  /**
   * Throws ForbiddenException if the current user cannot access the patient.
   */
  private assertCanAccess(
    patient: { household: { chwId: string; chw?: { district: string | null } | null } },
    currentUser: AuthUser,
  ) {
    switch (currentUser.role) {
      case userRole.ADMIN:
        return;

      case userRole.CHW:
        if (patient.household.chwId !== currentUser.id) {
          throw new ForbiddenException('You can only access your own patients.');
        }
        return;

      case userRole.NURSE:
      case userRole.DOCTOR:
  
        return;

      case userRole.CHO:
      case userRole.SUPERVISOR:
        return;

      default:
        throw new ForbiddenException('Role cannot access this patient.');
    }
  }
}