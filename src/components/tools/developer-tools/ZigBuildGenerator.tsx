'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ZigBuildGenerator - Generate Zig build.zig file from project configuration.
 */
export default function ZigBuildGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('myproject');
  const [targetType, setTargetType] = useState<'exe' | 'lib' | 'shared_lib'>('exe');
  const [rootSource, setRootSource] = useState('src/main.zig');
  const [optimizeMode, setOptimizeMode] = useState<'Debug' | 'ReleaseSafe' | 'ReleaseFast' | 'ReleaseSmall'>('Debug');
  const [enableTests, setEnableTests] = useState(true);
  const [installArtifact, setInstallArtifact] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push('const std = @import("std");');
    lines.push('');
    lines.push('pub fn build(b: *std.Build) void {');
    lines.push('    const target = b.standardTargetOptions(.{});');
    lines.push(`    const optimize = b.standardOptimizeOption(.{});`);
    lines.push('');

    const addFn = targetType === 'exe' ? 'addExecutable' : targetType === 'lib' ? 'addStaticLibrary' : 'addSharedLibrary';
    lines.push(`    const ${projectName} = b.${addFn}(.{`);
    lines.push(`        .name = "${projectName}",`);
    lines.push(`        .root_source_file = b.path("${rootSource}"),`);
    lines.push('        .target = target,');
    lines.push('        .optimize = optimize,');
    lines.push('    });');
    lines.push('');

    if (installArtifact) {
      lines.push(`    b.installArtifact(${projectName});`);
      lines.push('');
    }

    if (targetType === 'exe') {
      lines.push(`    const run_cmd = b.addRunArtifact(${projectName});`);
      lines.push('    run_cmd.step.dependOn(b.getInstallStep());');
      lines.push('');
      lines.push('    if (b.args) |args| {');
      lines.push('        run_cmd.addArgs(args);');
      lines.push('    }');
      lines.push('');
      lines.push('    const run_step = b.step("run", "Run the application");');
      lines.push('    run_step.dependOn(&run_cmd.step);');
      lines.push('');
    }

    if (enableTests) {
      lines.push('    const unit_tests = b.addTest(.{');
      lines.push(`        .root_source_file = b.path("${rootSource}"),`);
      lines.push('        .target = target,');
      lines.push('        .optimize = optimize,');
      lines.push('    });');
      lines.push('');
      lines.push('    const run_unit_tests = b.addRunArtifact(unit_tests);');
      lines.push('    const test_step = b.step("test", "Run unit tests");');
      lines.push('    test_step.dependOn(&run_unit_tests.step);');
    }

    lines.push('}');
    lines.push('');
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-name`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="input-field" aria-label={`Project name for ${toolName}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
              <select id={`${toolId}-type`} value={targetType} onChange={(e) => setTargetType(e.target.value as 'exe' | 'lib' | 'shared_lib')} className="input-field" aria-label="Target type">
                <option value="exe">Executable</option>
                <option value="lib">Static Library</option>
                <option value="shared_lib">Shared Library</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-opt`} className="block text-sm font-medium text-gray-700 mb-1">Optimize Mode</label>
              <select id={`${toolId}-opt`} value={optimizeMode} onChange={(e) => setOptimizeMode(e.target.value as 'Debug' | 'ReleaseSafe' | 'ReleaseFast' | 'ReleaseSmall')} className="input-field" aria-label="Optimize mode">
                <option value="Debug">Debug</option>
                <option value="ReleaseSafe">ReleaseSafe</option>
                <option value="ReleaseFast">ReleaseFast</option>
                <option value="ReleaseSmall">ReleaseSmall</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-root`} className="block text-sm font-medium text-gray-700 mb-1">Root Source File</label>
            <input id={`${toolId}-root`} type="text" value={rootSource} onChange={(e) => setRootSource(e.target.value)} className="input-field" aria-label="Root source file" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={enableTests} onChange={(e) => setEnableTests(e.target.checked)} className="rounded" />
              Include Tests
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={installArtifact} onChange={(e) => setInstallArtifact(e.target.checked)} className="rounded" />
              Install Artifact
            </label>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate build.zig</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated build.zig</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
