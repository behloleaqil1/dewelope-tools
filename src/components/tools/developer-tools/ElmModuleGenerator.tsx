'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElmModuleGenerator - Generate Elm module boilerplate with Model/Msg/Update/View.
 * Creates a complete Elm Architecture module structure.
 */
export default function ElmModuleGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [moduleName, setModuleName] = useState('');
  const [modelFields, setModelFields] = useState('');
  const [messages, setMessages] = useState('');
  const [includeHttp, setIncludeHttp] = useState(false);
  const [includeSubscriptions, setIncludeSubscriptions] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!moduleName.trim()) return;

    const name = moduleName.trim();
    const fields = modelFields.split('\n').map(f => f.trim()).filter(Boolean);
    const msgs = messages.split('\n').map(m => m.trim()).filter(Boolean);

    const imports = [
      'import Browser',
      'import Html exposing (Html, div, text, button, input, h1)',
      'import Html.Attributes exposing (class, value, placeholder)',
      'import Html.Events exposing (onClick, onInput)',
    ];

    if (includeHttp) {
      imports.push('import Http');
      imports.push('import Json.Decode as Decode');
    }

    const modelType = fields.length > 0
      ? `type alias Model =\n    { ${fields.map((f) => {
          const parts = f.split(':');
          const fieldName = parts[0]?.trim() || f;
          const fieldType = parts[1]?.trim() || 'String';
          return `${fieldName} : ${fieldType}`;
        }).join('\n    , ')}\n    }`
      : `type alias Model =\n    { placeholder : String\n    }`;

    const initFields = fields.length > 0
      ? fields.map(f => {
          const parts = f.split(':');
          const fieldName = parts[0]?.trim() || f;
          const fieldType = parts[1]?.trim() || 'String';
          let defaultVal = '""';
          if (fieldType === 'Int') defaultVal = '0';
          else if (fieldType === 'Float') defaultVal = '0.0';
          else if (fieldType === 'Bool') defaultVal = 'False';
          else if (fieldType.startsWith('List')) defaultVal = '[]';
          else if (fieldType === 'Maybe') defaultVal = 'Nothing';
          return `${fieldName} = ${defaultVal}`;
        }).join('\n    , ')
      : 'placeholder = ""';

    const msgType = msgs.length > 0
      ? `type Msg\n    = ${msgs.join('\n    | ')}`
      : `type Msg\n    = NoOp`;

    const updateCases = msgs.length > 0
      ? msgs.map(m => {
          return `        ${m} ->\n            ( model, Cmd.none )`;
        }).join('\n\n')
      : '        NoOp ->\n            ( model, Cmd.none )';

    let code = `module ${name} exposing (main)

${imports.join('\n')}


-- MODEL

${modelType}


init : ( Model, Cmd Msg )
init =
    ( { ${initFields} }
    , Cmd.none
    )


-- MSG

${msgType}


-- UPDATE

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
${updateCases}


-- VIEW

view : Model -> Html Msg
view model =
    div [ class "${name.toLowerCase()}" ]
        [ h1 [] [ text "${name}" ]
        , div [] [ text "Hello from ${name}!" ]
        ]

`;

    if (includeSubscriptions) {
      code += `
-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none

`;
    }

    code += `
-- MAIN

main : Program () Model Msg
main =
    Browser.${includeSubscriptions ? 'element' : 'sandbox'}
        { init = ${includeSubscriptions ? '\\_ -> init' : '\\_ -> Tuple.first init'}
        , update = update
        , view = view${includeSubscriptions ? '\n        , subscriptions = subscriptions' : ''}
        }
`;

    setOutput(code);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Module Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          placeholder="e.g. Main, Counter, TodoList"
          aria-label={`Module name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-fields`} className="block text-sm font-medium text-gray-700 mb-1">
          Model Fields (one per line, format: name : Type)
        </label>
        <textarea
          id={`${toolId}-fields`}
          value={modelFields}
          onChange={(e) => setModelFields(e.target.value)}
          placeholder="count : Int&#10;name : String&#10;items : List String"
          aria-label={`Model fields for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-msgs`} className="block text-sm font-medium text-gray-700 mb-1">
          Messages (one per line)
        </label>
        <textarea
          id={`${toolId}-msgs`}
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
          placeholder="Increment&#10;Decrement&#10;Reset&#10;UpdateName String"
          aria-label={`Messages for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={includeHttp}
            onChange={(e) => setIncludeHttp(e.target.checked)}
            className="rounded border-gray-300"
          />
          Include HTTP
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={includeSubscriptions}
            onChange={(e) => setIncludeSubscriptions(e.target.checked)}
            className="rounded border-gray-300"
          />
          Include Subscriptions
        </label>
      </div>

      <button onClick={generate} aria-label="Generate Elm module" className="btn-primary">
        Generate Module
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Elm Module</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
