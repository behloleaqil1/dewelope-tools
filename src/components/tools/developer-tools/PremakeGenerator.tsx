'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PremakeGenerator - Generate Premake5 build scripts in Lua.
 */
export default function PremakeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [workspaceName, setWorkspaceName] = useState('MyWorkspace');
  const [projectName, setProjectName] = useState('MyProject');
  const [language, setLanguage] = useState<'C++' | 'C' | 'C#'>('C++');
  const [kind, setKind] = useState<'ConsoleApp' | 'WindowedApp' | 'SharedLib' | 'StaticLib'>('ConsoleApp');
  const [cppDialect, setCppDialect] = useState('C++17');
  const [sourceDir, setSourceDir] = useState('src');
  const [includeDir, setIncludeDir] = useState('include');
  const [links, setLinks] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const linkList = links.split('\n').filter(l => l.trim());
    let script = `-- Premake5 build script
-- Generated for: ${workspaceName}

workspace "${workspaceName}"
   configurations { "Debug", "Release" }
   platforms { "x64" }

project "${projectName}"
   kind "${kind}"
   language "${language}"
`;

    if (language === 'C++') {
      script += `   cppdialect "${cppDialect}"\n`;
    }

    script += `   targetdir "bin/%{cfg.buildcfg}"
   objdir "obj/%{cfg.buildcfg}"

   files {
      "${sourceDir}/**.h",
      "${sourceDir}/**.hpp",
      "${sourceDir}/**.c",
      "${sourceDir}/**.cpp"
   }

   includedirs {
      "${includeDir}"
   }
`;

    if (linkList.length > 0) {
      script += `\n   links {\n`;
      linkList.forEach(l => {
        script += `      "${l.trim()}",\n`;
      });
      script += `   }\n`;
    }

    script += `
   filter "configurations:Debug"
      defines { "DEBUG" }
      symbols "On"
      runtime "Debug"

   filter "configurations:Release"
      defines { "NDEBUG" }
      optimize "On"
      runtime "Release"
`;

    setOutput(script);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-workspace`} className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
            <input id={`${toolId}-workspace`} type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} className="input-field" aria-label={`Workspace name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-project`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-project`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="input-field" aria-label="Project name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-lang`} className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select id={`${toolId}-lang`} value={language} onChange={(e) => setLanguage(e.target.value as 'C++' | 'C' | 'C#')} className="input-field" aria-label="Programming language">
              <option value="C++">C++</option>
              <option value="C">C</option>
              <option value="C#">C#</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-kind`} className="block text-sm font-medium text-gray-700 mb-1">Kind</label>
            <select id={`${toolId}-kind`} value={kind} onChange={(e) => setKind(e.target.value as 'ConsoleApp' | 'WindowedApp' | 'SharedLib' | 'StaticLib')} className="input-field" aria-label="Project kind">
              <option value="ConsoleApp">Console App</option>
              <option value="WindowedApp">Windowed App</option>
              <option value="SharedLib">Shared Library</option>
              <option value="StaticLib">Static Library</option>
            </select>
          </div>
          {language === 'C++' && (
            <div>
              <label htmlFor={`${toolId}-dialect`} className="block text-sm font-medium text-gray-700 mb-1">C++ Dialect</label>
              <select id={`${toolId}-dialect`} value={cppDialect} onChange={(e) => setCppDialect(e.target.value)} className="input-field" aria-label="C++ dialect">
                <option value="C++14">C++14</option>
                <option value="C++17">C++17</option>
                <option value="C++20">C++20</option>
                <option value="C++23">C++23</option>
              </select>
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-srcdir`} className="block text-sm font-medium text-gray-700 mb-1">Source Directory</label>
            <input id={`${toolId}-srcdir`} type="text" value={sourceDir} onChange={(e) => setSourceDir(e.target.value)} className="input-field" aria-label="Source directory" />
          </div>
          <div>
            <label htmlFor={`${toolId}-incdir`} className="block text-sm font-medium text-gray-700 mb-1">Include Directory</label>
            <input id={`${toolId}-incdir`} type="text" value={includeDir} onChange={(e) => setIncludeDir(e.target.value)} className="input-field" aria-label="Include directory" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-links`} className="block text-sm font-medium text-gray-700 mb-1">Link Libraries (one per line, optional)</label>
          <textarea id={`${toolId}-links`} value={links} onChange={(e) => setLinks(e.target.value)} className="input-field h-20 resize-y font-mono" aria-label="Link libraries" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate premake5.lua</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated premake5.lua</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
