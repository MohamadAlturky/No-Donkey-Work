"use client"
import React, { useRef, useState } from 'react';

import Editor from '@monaco-editor/react';
import { DiffEditor } from '@monaco-editor/react';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function App() {
    const editorRef = useRef(null);
    const [code, setCode] = useState('')
    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    return (
        <div style={{
            height: "100vh"
        }}>

            <ResizablePanelGroup
                direction="vertical"
                className="min-h-full"
            >
                <ResizablePanel defaultSize={75}>
                    <div className="flex h-full items-center justify-center">
                        <Editor
                            defaultLanguage="csharp"
                            defaultValue={code}
                            onMount={handleEditorDidMount}
                            theme='vs-dark'
                            onChange={(v) => setCode(v)}
                            options={
                                {
                                    fontSize: 30,
                                    minimap: {
                                        enable: true,
                                        scale: 20
                                    },
                                }
                            }
                        />
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={25}>
                    <div className="flex h-full items-center justify-center">
                        <DiffEditor
                            theme='vs-dark'
                            original={code}
                            modified='// new code'
                            options={
                                {
                                    fontSize: 30,
                                }}

                        />                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}