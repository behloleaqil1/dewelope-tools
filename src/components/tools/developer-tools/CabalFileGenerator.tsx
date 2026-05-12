'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CabalFileGenerator - Generate Haskell Cabal .cabal file from user inputs.
 */
export default function CabalFileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('0.1.0.0');
  const [synopsis, setSynopsis] = useState('');
  const [author, setAuthor] = useState('');
  const [license, setLicense] = useState('MIT');
  const [category, setCategory] = useState('');
  const [ghcVersion, setGhcVersion] = useState('>=8.10');
  const [dependencies, setDependencies] = useState('base >=4.7 && <5');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!packageName.trim()) {
      setOutput('Error: Package name is required.');
      return;
    }

    const deps = dependencies.split('\n').filter(d => d.trim()).map(d => `    ${d.trim()}`).join(',\n');

    const cabal = `cabal-version: 2.4
name:          ${packageName.trim()}
version:       ${version.trim()}
synopsis:      ${synopsis.trim()}
author:        ${author.trim()}
maintainer:    ${author.trim()}
license:       ${license}
license-file:  LICENSE
category:      ${category.trim()}
build-type:    Simple

common common-options
  default-language: Haskell2010
  ghc-options:     -Wall -Wcompat -Widentities -Wredundant-constraints
  build-depends:
${deps}

library
  import:         common-options
  hs-source-dirs: src
  exposed-modules:
    Lib

executable ${packageName.trim()}
  import:         common-options
  hs-source-dirs: app
  main-is:        Main.hs
  build-depends:
    ${packageName.trim()}

test-suite ${packageName.trim()}-test
  import:         common-options
  type:           exitcode-stdio-1.0
  hs-source-dirs: test
  main-is:        Spec.hs
  build-depends:
    ${packageName.trim()},
    hspec >=2.0
`;

    setOutput(cabal);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
            <input id={`${toolId}-name`} type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="my-package" aria-label={`Package name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="0.1.0.0" aria-label="Package version" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-author`} className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input id={`${toolId}-author`} type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your Name" aria-label="Author name" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">License</label>
            <select id={`${toolId}-license`} value={license} onChange={(e) => setLicense(e.target.value)} aria-label="License type" className="input-field">
              <option value="MIT">MIT</option>
              <option value="BSD-3-Clause">BSD-3-Clause</option>
              <option value="Apache-2.0">Apache-2.0</option>
              <option value="GPL-3.0-only">GPL-3.0</option>
              <option value="ISC">ISC</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-category`} className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input id={`${toolId}-category`} type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Web, Data, etc." aria-label="Package category" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ghc`} className="block text-sm font-medium text-gray-700 mb-1">GHC Version</label>
            <input id={`${toolId}-ghc`} type="text" value={ghcVersion} onChange={(e) => setGhcVersion(e.target.value)} placeholder=">=8.10" aria-label="GHC version constraint" className="input-field" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-synopsis`} className="block text-sm font-medium text-gray-700 mb-1">Synopsis</label>
          <input id={`${toolId}-synopsis`} type="text" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder="A short description of the package" aria-label="Package synopsis" className="input-field" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (one per line)</label>
          <textarea id={`${toolId}-deps`} value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder="base >=4.7 && <5" aria-label="Package dependencies" className="input-field h-24 resize-y font-mono" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate .cabal File</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated .cabal File</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
