import { useRef } from 'react'
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';

import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

import './css/code-editor.css';
import './css/syntax.css'


interface CodeEditorProps {
  initialValue: string;
  onChange(value:string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue}) => {
  const editorRef = useRef<any>();
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current= monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    })

    monacoEditor.getModel()?.updateOptions({ tabSize: 2});

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );

    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = () => {
    const unformattedValue = editorRef.current.getModel().getValue();

    const formattedValue = prettier.format(unformattedValue, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true
    }).replace(/\n$/, '');
    editorRef.current.setValue(formattedValue);
  }
  return (
    <div className="editor__wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}>
          Make it Pretty</button>
      <MonacoEditor
        language="javascript"
        editorDidMount={onEditorDidMount}
        value= {initialValue}
        height="100%"
        theme="dark"
        options={{
          wordWrap: 'on',
          minimap: {enabled: false},
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize:16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
    )
}

export default CodeEditor;