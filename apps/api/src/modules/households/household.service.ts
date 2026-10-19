import { Injectable, NotFoundException, Logger, ForbiddenException } from "@nestjs/common";

import { userRole } from "../../common/constants/roles.enum";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthUser } from "../../common/decorators/current-user.decorator";
import { CreateHouseholdDto } from "./dto/create-household.dto";

@Injectable()
export class HouseholdServices{
    private readonly logger = new Logger(HouseholdServices.name);
    constructor(private readonly prisma:PrismaService) {}

    async create(dto: CreateHouseholdDto, currentUser:AuthUser){
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
          headName: dto.headName,
          headId: dto.headId ?? null,
         
        },
      });
    }
      this.logger.log(
      `Household created: ${household.headName} by ${currentUser.role} ${currentUser.id}`,
    );

    return household;
    }

    // get all households
    async findAll(currentUser:AuthUser){
        // get household for user based on role
        let where: any = {};
        
            switch (currentUser.role) {
              case userRole.ADMIN:
                // Admin sees everything
                break;
        
              case userRole.CHW:
                // CHW sees only their own households
                where.chwId = currentUser.id;
                break;
        
              case userRole.CHO:
              case userRole.SUPERVISOR: {
                // CHO/SUPERVISOR see households of their supervised CHWs
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
                throw new ForbiddenException('Role cannot access households.');
            }
        return this.prisma.household.findMany({
          where,
          include:{
            _count:{
                select:{individuals:true},
            },
            chw:{
                select:{id:true, firstName:true,lastName:true},
            },

          } ,
          orderBy:{createdAt:'desc'}, 

        });
        

    }

// find by family head Id
async findByHeadId(headId:string, currentUser:AuthUser){
    const house = await this.prisma.household.findUnique({
        where:{headId},
        include:{
            chw:{
                select:{id:true, firstName:true, lastName:true},
            },
            _count:{
                select:{individuals:true},
            },
        },
    });

    if(!house){
        throw new NotFoundException('Household not found');
    }
    // enforce role based access
    if(currentUser.role === userRole.CHW && house.chwId !== currentUser.id)
    {
        throw new ForbiddenException('You can only access your own households.');
    }
    return house;
}


























































}