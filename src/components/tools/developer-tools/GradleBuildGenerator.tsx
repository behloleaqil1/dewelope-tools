'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GradleBuildGenerator - Generate Gradle build.gradle from project settings.
 * Supports Java/Kotlin projects with configurable plugins, dependencies, and repositories.
 */
export default function GradleBuildGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [groupId, setGroupId] = useState('');
  const [artifactId, setArtifactId] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [language, setLanguage] = useState<'java' | 'kotlin'>('java');
  const [javaVersion, setJavaVersion] = useState('17');
  const [appType, setAppType] = useState<'application' | 'library'>('application');
  const [mainClass, setMainClass] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [useSpringBoot, setUseSpringBoot] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!groupId.trim() || !artifactId.trim()) return;

    const lines: string[] = [];
    lines.push('plugins {');
    if (language === 'java') {
      lines.push(`    id '${appType === 'application' ? 'application' : 'java-library'}'`);
    } else {
      lines.push(`    id 'org.jetbrains.kotlin.jvm' version '1.9.22'`);
      if (appType === 'application') lines.push(`    id 'application'`);
    }
    if (useSpringBoot) {
      lines.push(`    id 'org.springframework.boot' version '3.2.2'`);
      lines.push(`    id 'io.spring.dependency-management' version '1.1.4'`);
    }
    lines.push('}');
    lines.push('');
    lines.push(`group = '${groupId.trim()}'`);
    lines.push(`version = '${version}'`);
    lines.push('');
    lines.push(`java {`);
    lines.push(`    sourceCompatibility = JavaVersion.VERSION_${javaVersion}`);
    lines.push(`    targetCompatibility = JavaVersion.VERSION_${javaVersion}`);
    lines.push('}');
    lines.push('');
    lines.push('repositories {');
    lines.push('    mavenCentral()');
    lines.push('}');
    lines.push('');
    lines.push('dependencies {');
    if (useSpringBoot) {
      lines.push(`    implementation 'org.springframework.boot:spring-boot-starter'`);
      lines.push(`    testImplementation 'org.springframework.boot:spring-boot-starter-test'`);
    }
    if (language === 'kotlin') {
      lines.push(`    implementation 'org.jetbrains.kotlin:kotlin-stdlib'`);
    }
    if (dependencies.trim()) {
      const deps = dependencies.split('\n').filter(d => d.trim());
      deps.forEach(dep => {
        const trimmed = dep.trim();
        if (trimmed.startsWith('test:')) {
          lines.push(`    testImplementation '${trimmed.replace('test:', '').trim()}'`);
        } else {
          lines.push(`    implementation '${trimmed}'`);
        }
      });
    }
    if (!useSpringBoot) {
      lines.push(`    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.1'`);
    }
    lines.push('}');
    lines.push('');
    if (appType === 'application' && mainClass.trim()) {
      lines.push(`application {`);
      lines.push(`    mainClass = '${mainClass.trim()}'`);
      lines.push('}');
      lines.push('');
    }
    lines.push('tasks.named(\'test\') {');
    lines.push('    useJUnitPlatform()');
    lines.push('}');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-group`} className="block text-sm font-medium text-gray-700 mb-1">
              Group ID *
            </label>
            <input
              id={`${toolId}-group`}
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="com.example"
              aria-label={`Group ID for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-artifact`} className="block text-sm font-medium text-gray-700 mb-1">
              Artifact ID *
            </label>
            <input
              id={`${toolId}-artifact`}
              type="text"
              value={artifactId}
              onChange={(e) => setArtifactId(e.target.value)}
              placeholder="my-app"
              aria-label="Artifact ID"
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
            <label htmlFor={`${toolId}-lang`} className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              id={`${toolId}-lang`}
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'java' | 'kotlin')}
              aria-label="Project language"
              className="input-field"
            >
              <option value="java">Java</option>
              <option value="kotlin">Kotlin</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-java-ver`} className="block text-sm font-medium text-gray-700 mb-1">
              Java Version
            </label>
            <select
              id={`${toolId}-java-ver`}
              value={javaVersion}
              onChange={(e) => setJavaVersion(e.target.value)}
              aria-label="Java version"
              className="input-field"
            >
              <option value="11">11</option>
              <option value="17">17</option>
              <option value="21">21</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Project Type
            </label>
            <select
              id={`${toolId}-type`}
              value={appType}
              onChange={(e) => setAppType(e.target.value as 'application' | 'library')}
              aria-label="Project type"
              className="input-field"
            >
              <option value="application">Application</option>
              <option value="library">Library</option>
            </select>
          </div>
        </div>
        {appType === 'application' && (
          <div className="mt-4">
            <label htmlFor={`${toolId}-main`} className="block text-sm font-medium text-gray-700 mb-1">
              Main Class
            </label>
            <input
              id={`${toolId}-main`}
              type="text"
              value={mainClass}
              onChange={(e) => setMainClass(e.target.value)}
              placeholder="com.example.Main"
              aria-label="Main class"
              className="input-field"
            />
          </div>
        )}
        <div className="mt-4 flex items-center gap-2">
          <input
            id={`${toolId}-spring`}
            type="checkbox"
            checked={useSpringBoot}
            onChange={(e) => setUseSpringBoot(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor={`${toolId}-spring`} className="text-sm font-medium text-gray-700">
            Include Spring Boot
          </label>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">
            Dependencies (one per line, prefix with &quot;test:&quot; for test deps)
          </label>
          <textarea
            id={`${toolId}-deps`}
            value={dependencies}
            onChange={(e) => setDependencies(e.target.value)}
            placeholder="com.google.guava:guava:32.1.3-jre&#10;test:org.mockito:mockito-core:5.8.0"
            aria-label="Project dependencies"
            className="input-field h-24 resize-y font-mono"
          />
        </div>
        <button
          onClick={generate}
          disabled={!groupId.trim() || !artifactId.trim()}
          className="btn-primary mt-4"
        >
          Generate build.gradle
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">build.gradle</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
