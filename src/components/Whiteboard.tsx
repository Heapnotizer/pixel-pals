import React, { useEffect, useRef, useState } from 'react';
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { socket } from '@/lib/socket';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@/rtk/hooks';

const Whiteboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const chat_id: string = searchParams.get('chat_id') || '';
  const userID: string | null = useAppSelector((state) => state.auth.userId);
  
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const isApplyingRemote = useRef(false);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastEmitTime = useRef<number>(0);

  useEffect(() => {
    socket.emit('join-chat', chat_id, userID);

    const handleDrawing = (data: any) => {
      if (data.chat_id === chat_id && excalidrawAPI && data.elements) {
        isApplyingRemote.current = true;
        excalidrawAPI.updateScene({
          elements: data.elements,
          appState: data.appState,
        });
        setTimeout(() => {
          isApplyingRemote.current = false;
        }, 50);
      }
    };
    
    socket.on('drawing', handleDrawing);

    return () => {
      socket.off('drawing', handleDrawing);
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [chat_id, userID, excalidrawAPI]);

  const emitDrawing = (elements: readonly any[], appState: any) => {
    socket.emit('drawing', {
      chat_id,
      elements: elements,
      appState: {
        viewBackgroundColor: appState.viewBackgroundColor,
        currentItemStrokeColor: appState.currentItemStrokeColor,
        currentItemBackgroundColor: appState.currentItemBackgroundColor,
      }
    });
    lastEmitTime.current = Date.now();
  };

  const handleChange = (elements: readonly any[], appState: any) => {
    if (isApplyingRemote.current) return;
    
    const now = Date.now();
    const timeSinceLastEmit = now - lastEmitTime.current;
    
    // Immediate emit if enough time has passed (throttle)
    if (timeSinceLastEmit >= 30) { // 30ms = ~33 updates/sec
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
        throttleTimeout.current = null;
      }
      emitDrawing(elements, appState);
    } else {
      // Schedule throttled emit
      if (!throttleTimeout.current) {
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null;
          emitDrawing(elements, appState);
        }, 30 - timeSinceLastEmit);
      }
    }
    
    // Final complete update after user stops drawing (debounce)
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      emitDrawing(elements, appState);
      debounceTimeout.current = null;
    }, 200); // Wait 200ms after last change
  };

  return (
      <div style={{ height: "60vh" }}>
        <Excalidraw
          excalidrawAPI={api => setExcalidrawAPI(api)}
          onChange={handleChange}
        />
      </div>
  );
};

export default Whiteboard;