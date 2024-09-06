"use client"
import { ChangeEventHandler, useCallback, useState, useRef } from 'react';
import {
    ReactFlow,
    addEdge,
    Node,
    useReactFlow,
    useNodesState,
    useEdgesState,
    OnConnect,
    Edge,
    MiniMap,
    Background,
    Controls,
    Panel,
    ControlButton,
    ColorMode,
    Position,
    ReactFlowProvider
} from '@xyflow/react';
import { FitViewIcon } from "./Icons/FitView";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import CustomContextMenu from './CustomContextMenu';

import '@xyflow/react/dist/style.css';

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
};

const initialNodes = [
    {
        id: 'A',
        type: 'input',
        position: { x: 0, y: 150 },
        data: { label: 'A' },
        ...nodeDefaults,
    },
    {
        id: 'B',
        position: { x: 250, y: 0 },
        data: { label: 'B' },
        ...nodeDefaults,
    },
    {
        id: 'C',
        position: { x: 250, y: 150 },
        data: { label: 'C' },
        ...nodeDefaults,
    },
    {
        id: 'D',
        position: { x: 250, y: 300 },
        data: { label: 'D' },
        ...nodeDefaults,
    },
];

const initialEdges = [
    {
        id: 'A-B',
        source: 'A',
        target: 'B',
    },
    {
        id: 'A-C',
        source: 'A',
        target: 'C',
    },
    {
        id: 'A-D',
        source: 'A',
        target: 'D',
    },
];
const nodeTypes = {}
const ColorModeFlow = () => {
    const [colorMode, setColorMode] = useState('light');
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { setViewport, zoomIn, zoomOut } = useReactFlow();
    const [menu, setMenu] = useState(null);
    const ref = useRef(null);
    const handleTransform = useCallback(() => {
        setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 });
    }, [setViewport]);

    const onNodeContextMenu = useCallback(
        (event, node) => {
            // Prevent native context menu from showing
            event.preventDefault();

            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            const pane = ref.current.getBoundingClientRect();
            setMenu({
                id: node.id,
                top: event.clientY < pane.height - 200 && event.clientY,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom:
                    event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setMenu],
    );
    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);
    const [editId, setEditId] = useState("");

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );


    const onChange = (evt) => {
        setColorMode(evt.target.value);
    };
    const [reactFlowInstance, setReactFlowInstance] = useState();
    const onInit = (rfi) => setReactFlowInstance(rfi);
    return (
        <div style={{
            height: "100vh",
            width: "100vw",
        }}>
            <ContextMenu>
                <ContextMenuTrigger>


                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        colorMode={colorMode}
                        fitView
                        onInit={onInit}
                        ref={ref}
                        nodeTypes={nodeTypes}
                        onPaneClick={onPaneClick}
                        onNodeContextMenu={onNodeContextMenu}
                    >
                        {menu && <CustomContextMenu onClick={onPaneClick} {...menu} onEdit={(id) => {
                            setEditNameModalOpen(true)
                            setEditId(id)
                        }} />}
                        <MiniMap zoomable pannable />
                        <Background />
                        <Controls showFitView={false} showInteractive={false}>
                            <ControlButton
                                title="fit content"
                                onClick={() =>
                                    reactFlowInstance.fitView({
                                        duration: 1200,
                                        padding: 0.3,
                                    })
                                }
                            >
                                <FitViewIcon />
                            </ControlButton>
                        </Controls>
                    </ReactFlow>

                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    <ContextMenuItem inset>
                        Back
                        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem inset disabled>
                        Forward
                        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem inset onClick={handleTransform}>
                        pan to center(0,0,1)
                        <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger inset>Color Mode</ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-48">
                            {colorMode == "dark" ?
                                <ContextMenuCheckboxItem checked onClick={() => { setColorMode("dark") }}>
                                    Dark
                                    <ContextMenuShortcut>⌘</ContextMenuShortcut>
                                </ContextMenuCheckboxItem>
                                :
                                <ContextMenuItem inset onClick={() => { setColorMode("dark") }}>
                                    Dark
                                    <ContextMenuShortcut>⌘</ContextMenuShortcut>
                                </ContextMenuItem>
                            }
                            {colorMode == "light" ?
                                <ContextMenuCheckboxItem checked onClick={() => { setColorMode("light") }}>
                                    Light
                                    <ContextMenuShortcut>⌘</ContextMenuShortcut>
                                </ContextMenuCheckboxItem>
                                :
                                <ContextMenuItem inset onClick={() => { setColorMode("light") }}>
                                    Light
                                    <ContextMenuShortcut>⌘</ContextMenuShortcut>
                                </ContextMenuItem>
                            }
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSeparator />
                    <ContextMenuCheckboxItem checked>
                        Show Bookmarks Bar
                        <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
                    </ContextMenuCheckboxItem>
                    <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
                    <ContextMenuSeparator />
                    <ContextMenuRadioGroup value="pedro">
                        <ContextMenuLabel inset>People</ContextMenuLabel>
                        <ContextMenuSeparator />
                        <ContextMenuRadioItem value="pedro">
                            Pedro Duarte
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
                    </ContextMenuRadioGroup>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
};


export default () => (
    <ReactFlowProvider>
        <ColorModeFlow />
    </ReactFlowProvider>
);