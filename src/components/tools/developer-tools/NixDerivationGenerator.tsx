'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NixDerivationGenerator - Generate Nix derivation/package expressions.
 * Creates a stdenv.mkDerivation or buildPythonPackage expression from user inputs.
 */
export default function NixDerivationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pkgName, setPkgName] = useState('');
  const [version, setVersion] = useState('');
  const [_src, _setSrc] = useState('github');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [sha256, setSha256] = useState('');
  const [buildInputs, setBuildInputs] = useState('');
  const [description, setDescription] = useState('');
  const [license, setLicense] = useState('mit');
  const [derivationType, setDerivationType] = useState('stdenv');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!pkgName.trim()) {
      setOutput('Please enter a package name.');
      return;
    }

    const ver = version.trim() || '0.1.0';
    const ownerStr = owner.trim() || 'owner';
    const repoStr = repo.trim() || pkgName.trim();
    const hashStr = sha256.trim() || 'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
    const desc = description.trim() || `A package for ${pkgName.trim()}`;
    const deps = buildInputs.trim() ? buildInputs.trim().split(/[,\s]+/).filter(Boolean) : [];

    let result = '';

    if (derivationType === 'stdenv') {
      result += `{ lib, stdenv, fetchFromGitHub${deps.length > 0 ? ', ' + deps.join(', ') : ''} }:\n\n`;
      result += `stdenv.mkDerivation rec {\n`;
      result += `  pname = "${pkgName.trim()}";\n`;
      result += `  version = "${ver}";\n\n`;
      result += `  src = fetchFromGitHub {\n`;
      result += `    owner = "${ownerStr}";\n`;
      result += `    repo = "${repoStr}";\n`;
      result += `    rev = "v\${version}";\n`;
      result += `    hash = "${hashStr}";\n`;
      result += `  };\n\n`;
      if (deps.length > 0) {
        result += `  buildInputs = [ ${deps.join(' ')} ];\n\n`;
      }
      result += `  meta = with lib; {\n`;
      result += `    description = "${desc}";\n`;
      result += `    homepage = "https://github.com/${ownerStr}/${repoStr}";\n`;
      result += `    license = licenses.${license};\n`;
      result += `    maintainers = with maintainers; [ ];\n`;
      result += `    platforms = platforms.all;\n`;
      result += `  };\n`;
      result += `}\n`;
    } else {
      result += `{ lib, python3Packages, fetchFromGitHub }:\n\n`;
      result += `python3Packages.buildPythonPackage rec {\n`;
      result += `  pname = "${pkgName.trim()}";\n`;
      result += `  version = "${ver}";\n`;
      result += `  format = "setuptools";\n\n`;
      result += `  src = fetchFromGitHub {\n`;
      result += `    owner = "${ownerStr}";\n`;
      result += `    repo = "${repoStr}";\n`;
      result += `    rev = "v\${version}";\n`;
      result += `    hash = "${hashStr}";\n`;
      result += `  };\n\n`;
      if (deps.length > 0) {
        result += `  propagatedBuildInputs = with python3Packages; [\n`;
        deps.forEach(d => { result += `    ${d}\n`; });
        result += `  ];\n\n`;
      }
      result += `  meta = with lib; {\n`;
      result += `    description = "${desc}";\n`;
      result += `    homepage = "https://github.com/${ownerStr}/${repoStr}";\n`;
      result += `    license = licenses.${license};\n`;
      result += `    maintainers = with maintainers; [ ];\n`;
      result += `  };\n`;
      result += `}\n`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Derivation Type
            </label>
            <select
              id={`${toolId}-type`}
              value={derivationType}
              onChange={(e) => setDerivationType(e.target.value)}
              className="input-field"
              aria-label={`Derivation type for ${toolName}`}
            >
              <option value="stdenv">stdenv.mkDerivation</option>
              <option value="python">buildPythonPackage</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Package Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={pkgName}
              onChange={(e) => setPkgName(e.target.value)}
              placeholder="e.g. my-package"
              className="input-field"
              aria-label="Package name"
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
              placeholder="e.g. 1.0.0"
              className="input-field"
              aria-label="Package version"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-owner`} className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Owner
            </label>
            <input
              id={`${toolId}-owner`}
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. NixOS"
              className="input-field"
              aria-label="GitHub owner"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-repo`} className="block text-sm font-medium text-gray-700 mb-1">
              Repository Name
            </label>
            <input
              id={`${toolId}-repo`}
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="e.g. nixpkgs"
              className="input-field"
              aria-label="Repository name"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-sha`} className="block text-sm font-medium text-gray-700 mb-1">
              SHA256 Hash
            </label>
            <input
              id={`${toolId}-sha`}
              type="text"
              value={sha256}
              onChange={(e) => setSha256(e.target.value)}
              placeholder="sha256-..."
              className="input-field"
              aria-label="SHA256 hash"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">
              Build Inputs (comma-separated)
            </label>
            <input
              id={`${toolId}-deps`}
              type="text"
              value={buildInputs}
              onChange={(e) => setBuildInputs(e.target.value)}
              placeholder="e.g. cmake, pkg-config"
              className="input-field"
              aria-label="Build inputs"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">
              License
            </label>
            <select
              id={`${toolId}-license`}
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="input-field"
              aria-label="License"
            >
              <option value="mit">MIT</option>
              <option value="asl20">Apache 2.0</option>
              <option value="gpl3Only">GPL 3.0</option>
              <option value="bsd3">BSD 3-Clause</option>
              <option value="mpl20">MPL 2.0</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id={`${toolId}-desc`}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short package description"
              className="input-field"
              aria-label="Package description"
            />
          </div>
        </div>

        <button
          onClick={generate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Derivation
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nix Expression</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
