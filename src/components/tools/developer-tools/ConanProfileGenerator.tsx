'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ConanProfileGenerator - Generate C++ Conan conanfile.txt or conanfile.py configurations.
 */
export default function ConanProfileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [outputFormat, setOutputFormat] = useState<'txt' | 'py'>('txt');
  const [dependencies, setDependencies] = useState('');
  const [buildType, setBuildType] = useState('Release');
  const [compiler, setCompiler] = useState('gcc');
  const [cppStandard, setCppStandard] = useState('17');
  const [output, setOutput] = useState('');

  const generate = () => {
    const deps = dependencies
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    if (outputFormat === 'txt') {
      let result = '[requires]\n';
      deps.forEach((dep) => {
        result += `${dep}\n`;
      });
      result += '\n[generators]\nCMakeDeps\nCMakeToolchain\n';
      result += '\n[options]\n';
      result += `# Add package options here\n`;
      result += '\n[settings]\n';
      result += `os=Linux\n`;
      result += `compiler=${compiler}\n`;
      result += `compiler.cppstd=${cppStandard}\n`;
      result += `build_type=${buildType}\n`;
      setOutput(result);
    } else {
      let result = `from conan import ConanFile\nfrom conan.tools.cmake import CMake, cmake_layout\n\n`;
      result += `class ${projectName.replace(/[^a-zA-Z0-9]/g, '') || 'MyProject'}Conan(ConanFile):\n`;
      result += `    name = "${projectName || 'myproject'}"\n`;
      result += `    version = "${version}"\n`;
      result += `    settings = "os", "compiler", "build_type", "arch"\n`;
      result += `    generators = "CMakeDeps", "CMakeToolchain"\n\n`;
      if (deps.length > 0) {
        result += `    def requirements(self):\n`;
        deps.forEach((dep) => {
          result += `        self.requires("${dep}")\n`;
        });
        result += '\n';
      }
      result += `    def layout(self):\n`;
      result += `        cmake_layout(self)\n\n`;
      result += `    def build(self):\n`;
      result += `        cmake = CMake(self)\n`;
      result += `        cmake.configure()\n`;
      result += `        cmake.build()\n`;
      setOutput(result);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="myproject"
              aria-label={`Project name for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
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
              <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">
                Output Format
              </label>
              <select
                id={`${toolId}-format`}
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as 'txt' | 'py')}
                aria-label="Output format"
                className="input-field"
              >
                <option value="txt">conanfile.txt</option>
                <option value="py">conanfile.py</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-compiler`} className="block text-sm font-medium text-gray-700 mb-1">
                Compiler
              </label>
              <select
                id={`${toolId}-compiler`}
                value={compiler}
                onChange={(e) => setCompiler(e.target.value)}
                aria-label="Compiler"
                className="input-field"
              >
                <option value="gcc">GCC</option>
                <option value="clang">Clang</option>
                <option value="msvc">MSVC</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-std`} className="block text-sm font-medium text-gray-700 mb-1">
                C++ Standard
              </label>
              <select
                id={`${toolId}-std`}
                value={cppStandard}
                onChange={(e) => setCppStandard(e.target.value)}
                aria-label="C++ standard"
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
              <label htmlFor={`${toolId}-build`} className="block text-sm font-medium text-gray-700 mb-1">
                Build Type
              </label>
              <select
                id={`${toolId}-build`}
                value={buildType}
                onChange={(e) => setBuildType(e.target.value)}
                aria-label="Build type"
                className="input-field"
              >
                <option value="Release">Release</option>
                <option value="Debug">Debug</option>
                <option value="RelWithDebInfo">RelWithDebInfo</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">
              Dependencies (one per line, e.g. boost/1.82.0)
            </label>
            <textarea
              id={`${toolId}-deps`}
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              placeholder="boost/1.82.0&#10;fmt/10.1.1&#10;spdlog/1.12.0"
              aria-label="Dependencies list"
              className="input-field h-32 resize-y font-mono"
            />
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate Conan File
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Generated {outputFormat === 'txt' ? 'conanfile.txt' : 'conanfile.py'}
            </label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
