'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NestjsControllerGenerator - Generate NestJS controller boilerplate with decorators.
 * Supports CRUD operations, guards, pipes, and interceptors.
 */
export default function NestjsControllerGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [resourceName, setResourceName] = useState('');
  const [includeGet, setIncludeGet] = useState(true);
  const [includeGetById, setIncludeGetById] = useState(true);
  const [includePost, setIncludePost] = useState(true);
  const [includePut, setIncludePut] = useState(true);
  const [includeDelete, setIncludeDelete] = useState(true);
  const [includeGuard, setIncludeGuard] = useState(false);
  const [includeSwagger, setIncludeSwagger] = useState(false);
  const [output, setOutput] = useState('');

  function generate() {
    const raw = resourceName.trim() || 'item';
    const pascal = raw.charAt(0).toUpperCase() + raw.slice(1).replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
    const lower = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
    const plural = lower + 's';

    const imports: string[] = ['Controller'];
    if (includeGet) imports.push('Get');
    if (includeGetById) imports.push('Get', 'Param');
    if (includePost) imports.push('Post', 'Body');
    if (includePut) imports.push('Put', 'Param', 'Body');
    if (includeDelete) imports.push('Delete', 'Param');
    if (includeGuard) imports.push('UseGuards');
    const uniqueImports = [...new Set(imports)];

    let code = `import { ${uniqueImports.join(', ')} } from '@nestjs/common';\n`;
    if (includeGuard) {
      code += `import { AuthGuard } from '@nestjs/passport';\n`;
    }
    if (includeSwagger) {
      code += `import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';\n`;
    }
    code += `import { ${pascal}Service } from './${lower}.service';\n`;
    if (includePost || includePut) {
      code += `import { Create${pascal}Dto } from './dto/create-${lower}.dto';\n`;
    }
    if (includePut) {
      code += `import { Update${pascal}Dto } from './dto/update-${lower}.dto';\n`;
    }

    code += `\n`;
    if (includeSwagger) {
      code += `@ApiTags('${plural}')\n`;
    }
    if (includeGuard) {
      code += `@UseGuards(AuthGuard('jwt'))\n`;
    }
    code += `@Controller('${plural}')\n`;
    code += `export class ${pascal}Controller {\n`;
    code += `  constructor(private readonly ${lower}Service: ${pascal}Service) {}\n`;

    if (includeGet) {
      code += `\n`;
      if (includeSwagger) {
        code += `  @ApiOperation({ summary: 'Get all ${plural}' })\n`;
        code += `  @ApiResponse({ status: 200, description: 'Return all ${plural}' })\n`;
      }
      code += `  @Get()\n`;
      code += `  findAll() {\n`;
      code += `    return this.${lower}Service.findAll();\n`;
      code += `  }\n`;
    }

    if (includeGetById) {
      code += `\n`;
      if (includeSwagger) {
        code += `  @ApiOperation({ summary: 'Get ${lower} by id' })\n`;
        code += `  @ApiResponse({ status: 200, description: 'Return ${lower} by id' })\n`;
      }
      code += `  @Get(':id')\n`;
      code += `  findOne(@Param('id') id: string) {\n`;
      code += `    return this.${lower}Service.findOne(id);\n`;
      code += `  }\n`;
    }

    if (includePost) {
      code += `\n`;
      if (includeSwagger) {
        code += `  @ApiOperation({ summary: 'Create ${lower}' })\n`;
        code += `  @ApiResponse({ status: 201, description: '${pascal} created' })\n`;
      }
      code += `  @Post()\n`;
      code += `  create(@Body() create${pascal}Dto: Create${pascal}Dto) {\n`;
      code += `    return this.${lower}Service.create(create${pascal}Dto);\n`;
      code += `  }\n`;
    }

    if (includePut) {
      code += `\n`;
      if (includeSwagger) {
        code += `  @ApiOperation({ summary: 'Update ${lower}' })\n`;
        code += `  @ApiResponse({ status: 200, description: '${pascal} updated' })\n`;
      }
      code += `  @Put(':id')\n`;
      code += `  update(@Param('id') id: string, @Body() update${pascal}Dto: Update${pascal}Dto) {\n`;
      code += `    return this.${lower}Service.update(id, update${pascal}Dto);\n`;
      code += `  }\n`;
    }

    if (includeDelete) {
      code += `\n`;
      if (includeSwagger) {
        code += `  @ApiOperation({ summary: 'Delete ${lower}' })\n`;
        code += `  @ApiResponse({ status: 200, description: '${pascal} deleted' })\n`;
      }
      code += `  @Delete(':id')\n`;
      code += `  remove(@Param('id') id: string) {\n`;
      code += `    return this.${lower}Service.remove(id);\n`;
      code += `  }\n`;
    }

    code += `}\n`;

    setOutput(code);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Resource Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={resourceName}
          onChange={(e) => setResourceName(e.target.value)}
          placeholder="e.g. user, product, order"
          aria-label={`Resource name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-gray-700">CRUD Methods</span>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={includeGet} onChange={(e) => setIncludeGet(e.target.checked)} className="rounded" />
            GET (all)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={includeGetById} onChange={(e) => setIncludeGetById(e.target.checked)} className="rounded" />
            GET (by id)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={includePost} onChange={(e) => setIncludePost(e.target.checked)} className="rounded" />
            POST
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={includePut} onChange={(e) => setIncludePut(e.target.checked)} className="rounded" />
            PUT
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={includeDelete} onChange={(e) => setIncludeDelete(e.target.checked)} className="rounded" />
            DELETE
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeGuard} onChange={(e) => setIncludeGuard(e.target.checked)} className="rounded" />
          Auth Guard
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeSwagger} onChange={(e) => setIncludeSwagger(e.target.checked)} className="rounded" />
          Swagger Decorators
        </label>
      </div>

      <button onClick={generate} aria-label="Generate NestJS controller" className="btn-primary">
        Generate Controller
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Generated Controller</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
