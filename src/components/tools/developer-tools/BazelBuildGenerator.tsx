'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BazelBuildGenerator - Generate Bazel BUILD file rules.
 * Creates cc_binary, cc_library, java_binary, py_binary, and other common Bazel rules.
 */
export default function BazelBuildGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [ruleType, setRuleType] = useState('cc_binary');
  const [targetName, setTargetName] = useState('');
  const [srcs, setSrcs] = useState('');
  const [deps, setDeps] = useState('');
  const [hdrs, setHdrs] = useState('');
  const [visibility, setVisibility] = useState('//visibility:private');
  const [mainClass, setMainClass] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!targetName.trim()) {
      setOutput('Please enter a target name.');
      return;
    }

    const name = targetName.trim();
    const srcList = srcs.trim() ? srcs.trim().split(/[,\s]+/).filter(Boolean) : [];
    const depList = deps.trim() ? deps.trim().split(/[,\s]+/).filter(Boolean) : [];
    const hdrList = hdrs.trim() ? hdrs.trim().split(/[,\s]+/).filter(Boolean) : [];

    let result = '';

    const formatList = (items: string[]) => {
      if (items.length === 0) return '[]';
      if (items.length === 1) return `["${items[0]}"]`;
      return '[\n' + items.map(i => `        "${i}",`).join('\n') + '\n    ]';
    };

    result += `load("@rules_${ruleType.split('_')[0]}//` ;

    switch (ruleType) {
      case 'cc_binary':
      case 'cc_library':
        result = `load("@rules_cc//cc:defs.bzl", "${ruleType}")\n\n`;
        result += `${ruleType}(\n`;
        result += `    name = "${name}",\n`;
        if (srcList.length > 0) result += `    srcs = ${formatList(srcList)},\n`;
        else result += `    srcs = glob(["*.cc"]),\n`;
        if (ruleType === 'cc_library' && hdrList.length > 0) {
          result += `    hdrs = ${formatList(hdrList)},\n`;
        }
        if (depList.length > 0) result += `    deps = ${formatList(depList)},\n`;
        result += `    visibility = ["${visibility}"],\n`;
        result += `)\n`;
        break;
      case 'java_binary':
      case 'java_library':
        result = `load("@rules_java//java:defs.bzl", "${ruleType}")\n\n`;
        result += `${ruleType}(\n`;
        result += `    name = "${name}",\n`;
        if (srcList.length > 0) result += `    srcs = ${formatList(srcList)},\n`;
        else result += `    srcs = glob(["*.java"]),\n`;
        if (ruleType === 'java_binary' && mainClass.trim()) {
          result += `    main_class = "${mainClass.trim()}",\n`;
        }
        if (depList.length > 0) result += `    deps = ${formatList(depList)},\n`;
        result += `    visibility = ["${visibility}"],\n`;
        result += `)\n`;
        break;
      case 'py_binary':
      case 'py_library':
        result = `load("@rules_python//python:defs.bzl", "${ruleType}")\n\n`;
        result += `${ruleType}(\n`;
        result += `    name = "${name}",\n`;
        if (srcList.length > 0) result += `    srcs = ${formatList(srcList)},\n`;
        else result += `    srcs = glob(["*.py"]),\n`;
        if (depList.length > 0) result += `    deps = ${formatList(depList)},\n`;
        result += `    visibility = ["${visibility}"],\n`;
        result += `)\n`;
        break;
      case 'go_binary':
      case 'go_library':
        result = `load("@io_bazel_rules_go//go:def.bzl", "${ruleType}")\n\n`;
        result += `${ruleType}(\n`;
        result += `    name = "${name}",\n`;
        if (srcList.length > 0) result += `    srcs = ${formatList(srcList)},\n`;
        else result += `    srcs = glob(["*.go"]),\n`;
        if (depList.length > 0) result += `    deps = ${formatList(depList)},\n`;
        result += `    visibility = ["${visibility}"],\n`;
        result += `)\n`;
        break;
      default:
        result = `# Unknown rule type\n`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-rule`} className="block text-sm font-medium text-gray-700 mb-1">
              Rule Type
            </label>
            <select
              id={`${toolId}-rule`}
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value)}
              className="input-field"
              aria-label={`Rule type for ${toolName}`}
            >
              <option value="cc_binary">cc_binary</option>
              <option value="cc_library">cc_library</option>
              <option value="java_binary">java_binary</option>
              <option value="java_library">java_library</option>
              <option value="py_binary">py_binary</option>
              <option value="py_library">py_library</option>
              <option value="go_binary">go_binary</option>
              <option value="go_library">go_library</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Target Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="e.g. my_app"
              className="input-field"
              aria-label="Target name"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-srcs`} className="block text-sm font-medium text-gray-700 mb-1">
              Sources (comma-separated)
            </label>
            <input
              id={`${toolId}-srcs`}
              type="text"
              value={srcs}
              onChange={(e) => setSrcs(e.target.value)}
              placeholder="e.g. main.cc, util.cc"
              className="input-field"
              aria-label="Source files"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">
              Dependencies (comma-separated)
            </label>
            <input
              id={`${toolId}-deps`}
              type="text"
              value={deps}
              onChange={(e) => setDeps(e.target.value)}
              placeholder="e.g. //lib:mylib"
              className="input-field"
              aria-label="Dependencies"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-hdrs`} className="block text-sm font-medium text-gray-700 mb-1">
              Headers (for cc_library)
            </label>
            <input
              id={`${toolId}-hdrs`}
              type="text"
              value={hdrs}
              onChange={(e) => setHdrs(e.target.value)}
              placeholder="e.g. util.h, types.h"
              className="input-field"
              aria-label="Header files"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-vis`} className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <select
              id={`${toolId}-vis`}
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="input-field"
              aria-label="Visibility"
            >
              <option value="//visibility:private">{'//visibility:private'}</option>
              <option value="//visibility:public">{'//visibility:public'}</option>
            </select>
          </div>
          {(ruleType === 'java_binary') && (
            <div>
              <label htmlFor={`${toolId}-main`} className="block text-sm font-medium text-gray-700 mb-1">
                Main Class
              </label>
              <input
                id={`${toolId}-main`}
                type="text"
                value={mainClass}
                onChange={(e) => setMainClass(e.target.value)}
                placeholder="e.g. com.example.Main"
                className="input-field"
                aria-label="Main class"
              />
            </div>
          )}
        </div>

        <button
          onClick={generate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate BUILD Rule
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">BUILD File Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
