import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BranchService } from '../../application/services/branch.service';

@ApiTags('Branches')
@Controller('branches')
export class BranchController {
    constructor(private readonly branchService: BranchService) { }

    /**
     * GET /branches
     * Public: List all active branches, optionally filtered by city
     */
    @Get()
    @ApiQuery({ name: 'city', required: false })
    async listBranches(@Query('city') city?: string) {
        return this.branchService.listBranches(city);
    }

    /**
     * GET /branches/:id
     * Public: Get branch details with all services and facilities
     */
    @Get(':id')
    async getBranch(@Param('id', ParseIntPipe) id: number) {
        const branch = await this.branchService.getBranchDetails(id);
        if (!branch) throw new NotFoundException(`Branch ${id} not found`);
        return branch;
    }
}
