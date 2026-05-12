'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CmakeGenerator - Generate CMakeLists.txt from project configuration.
 * Supports configuring project name, version, C++ standard, sources, and libraries.
 */
export default function CmakeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [cppStandard, setCppStandard] = useState('17');
  const [executableName, setExecutableName] = useState('');
  const [sourceFiles, setSourceFiles] = useState('');
  const [libraries, setLibraries] = useState('');
  const [includeDirectories, setIncludeDirectories] = useState('');
  const [cmakeMinVersion, setCmakeMinVersion] = useState('3.16');
  const [buildType, setBuildType] = useState('Release');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!projectName.trim()) return;

    const lines: string[] = [];
    lines.push(`cmake_minimum_required(VERSION ${cmakeMinVersion})`);
    lines.push('');
    lines.push(`project(${projectName.trim()} VERSION ${version})`);
    lines.push('');
    lines.push(`set(CMAKE_CXX_STANDARD ${cppStandard})`);
    lines.push('set(CMAKE_CXX_STANDARD_REQUIRED ON)');
    lines.push(`set(CMAKE_BUILD_TYPE ${buildType})`);
    lines.push('');

    if (includeDirectories.trim()) {
      const dirs = includeDirectories.split('\n').filter(d => d.trim());
      dirs.forEach(dir => {
        lines.push(`include_directories(\${PROJECT_SOURCE_DIR}/${dir.trim()})`);
      });
      lines.push('');
    }

    const sources = sourceFiles.trim()
      ? sourceFiles.split('\n').filter(s => s.trim()).map(s => `  ${s.trim()}`).join('\n')
      : '  main.cpp';

    const exeName = executableName.trim() || projectName.trim();
    lines.push(`add_executable(${exeName}`);
    lines.push(sources);
    lines.push(')');
    lines.push('');

    if (libraries.trim()) {
      const libs = libraries.split('\n').filter(l => l.trim());
      lines.push(`target_link_libraries(${exeName}`);
      libs.forEach(lib => {
        lines.push(`  ${lib.trim()}`);
      });
      lines.push(')');
      lines.push('');
    }

    lines.push(`# Build: mkdir build && cd build && cmake .. && make`);
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-project`} className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              id={`${toolId}-project`}
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="MyProject"
              aria-label={`Project name for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            <input
              id={`${toolId}-version`}
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              aria-label="Project version"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-standard`} className="block text-sm font-medium text-gray-700 mb-1">
              C++ Standard
            </label>
            <select
              id={`${toolId}-standard`}
              value={cppStandard}
              onChange={(e) => setCppStandard(e.target.value)}
              aria-label="C++ standard version"
              className="input-field"
            >
              <option value="11">C++11</option>
              <option value="14">C++14</option>
              <option value="17">C++17</option>
              <option value="20">C++20</option>
              <option value="23">C++23</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-cmake-ver`} className="block text-sm font-medium text-gray-700 mb-1">
              CMake Minimum Version
            </label>
            <input
              id={`${toolId}-cmake-ver`}
              type="text"
              value={cmakeMinVersion}
              onChange={(e) => setCmakeMinVersion(e.target.value)}
              placeholder="3.16"
              aria-label="CMake minimum version"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-exe`} className="block text-sm font-medium text-gray-700 mb-1">
              Executable Name (optional)
            </label>
            <input
              id={`${toolId}-exe`}
              type="text"
              value={executableName}
              onChange={(e) => setExecutableName(e.target.value)}
              placeholder="Defaults to project name"
              aria-label="Executable name"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-build-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Build Type
            </label>
            <select
              id={`${toolId}-build-type`}
              value={buildType}
              onChange={(e) => setBuildType(e.target.value)}
              aria-label="Build type"
              className="input-field"
            >
              <option value="Release">Release</option>
              <option value="Debug">Debug</option>
              <option value="RelWithDebInfo">RelWithDebInfo</option>
              <option value="MinSizeRel">MinSizeRel</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-sources`} className="block text-sm font-medium text-gray-700 mb-1">
            Source Files (one per line)
          </label>
          <textarea
            id={`${toolId}-sources`}
            value={sourceFiles}
            onChange={(e) => setSourceFiles(e.target.value)}
            placeholder="main.cpp&#10;src/app.cpp&#10;src/utils.cpp"
            aria-label="Source files list"
            className="input-field h-24 resize-y font-mono"
          />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-libs`} className="block text-sm font-medium text-gray-700 mb-1">
            Link Libraries (one per line)
          </label>
          <textarea
            id={`${toolId}-libs`}
            value={libraries}
            onChange={(e) => setLibraries(e.target.value)}
            placeholder="pthread&#10;boost_filesystem"
            aria-label="Libraries to link"
            className="input-field h-20 resize-y font-mono"
          />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-includes`} className="block text-sm font-medium text-gray-700 mb-1">
            Include Directories (one per line)
          </label>
          <textarea
            id={`${toolId}-includes`}
            value={includeDirectories}
            onChange={(e) => setIncludeDirectories(e.target.value)}
            placeholder="include&#10;third_party/headers"
            aria-label="Include directories"
            className="input-field h-20 resize-y font-mono"
          />
        </div>
        <button
          onClick={generate}
          disabled={!projectName.trim()}
          className="btn-primary mt-4"
        >
          Generate CMakeLists.txt
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CMakeLists.txt</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
