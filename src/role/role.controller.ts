import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { EditRoleRoutesDto, UpdateRoleDto } from './dto/update-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { Role } from './role.entity';
import { TimestampInterceptor } from '../interceptor/timestamp.interceptor';
import { GetRolePipe } from './pipes/get-role.pipe';

@Controller('role')
@UseInterceptors(TimestampInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Post(':id/editRoutes')
  editRoutes(
    @Param('id') id: string,
    @Body() editRoleRoutesDto: EditRoleRoutesDto,
  ): Promise<Role> {
    return this.roleService.editRoutes(id, editRoleRoutesDto.routeIds);
  }

  @Get()
  findAll(
    @Query(GetRolePipe) query: GetRoleDto,
  ): Promise<{ list: Role[]; total: number }> {
    return this.roleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Role> {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.roleService.remove(id);
  }
}
