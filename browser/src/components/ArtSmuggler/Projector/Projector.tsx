import { useEffect, useRef, useState } from "react";
import "./Projector.css";

interface ProjectorProps {
  imageUrls: string[];
}

// Positions are stored as fractions of the container so resizing keeps the layout
interface Position {
  x: number;
  y: number;
}

// Width of each layer as a fraction of the container width
const LAYER_WIDTH = 0.55;

export default function Projector({ imageUrls }: ProjectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ index: number; offsetX: number; offsetY: number } | null>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [activeIndex, setActiveIndex] = useState(imageUrls.length - 1);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const aspect = images.length > 0 ? images[0].naturalHeight / images[0].naturalWidth : 0;
  const layerHeight = LAYER_WIDTH * size.width * aspect;
  const layerHeightFraction = size.height > 0 ? layerHeight / size.height : 0;

  // Load all layers
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      imageUrls.map(
        (url) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
          })
      )
    ).then((loaded) => {
      if (!cancelled) setImages(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [imageUrls]);

  // Track container size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      setSize({ width: container.clientWidth, height: container.clientHeight });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const scatter = () => {
    const n = images.length;
    const maxX = 1 - LAYER_WIDTH;
    const maxY = Math.max(0, 1 - layerHeightFraction);
    setPositions(
      images.map((_, i) => ({
        x: n > 1 ? (i / (n - 1)) * maxX : maxX / 2,
        y: n > 1 ? (i / (n - 1)) * maxY : maxY / 2,
      }))
    );
  };

  const align = () => {
    const centre = {
      x: (1 - LAYER_WIDTH) / 2,
      y: Math.max(0, (1 - layerHeightFraction) / 2),
    };
    setPositions(images.map(() => ({ ...centre })));
  };

  // Initial scatter once images and size are known
  useEffect(() => {
    if (images.length > 0 && size.width > 0 && positions.length === 0) scatter();
  }, [images, size]);

  // Render the projected light: white, multiplied by every layer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size.width * dpr);
    canvas.height = Math.round(size.height * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size.width, size.height);
    ctx.globalCompositeOperation = "multiply";
    positions.forEach((pos, i) => {
      const img = images[i];
      if (!img) return;
      ctx.drawImage(
        img,
        Math.round(pos.x * size.width),
        Math.round(pos.y * size.height),
        Math.round(LAYER_WIDTH * size.width),
        Math.round(layerHeight)
      );
    });
  }, [images, positions, size]);

  const moveLayer = (index: number, x: number, y: number) => {
    setPositions((prev) => prev.map((pos, i) => (i === index ? { x, y } : pos)));
  };

  const handlePointerDown = (index: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      index,
      offsetX: e.clientX - rect.left - positions[index].x * size.width,
      offsetY: e.clientY - rect.top - positions[index].y * size.height,
    };
    setActiveIndex(index);
    container.focus({ preventScroll: true });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const container = containerRef.current;
    if (!drag || !container) return;
    const rect = container.getBoundingClientRect();
    moveLayer(
      drag.index,
      (e.clientX - rect.left - drag.offsetX) / size.width,
      (e.clientY - rect.top - drag.offsetY) / size.height
    );
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  // Arrow keys nudge the last dragged layer by 1px
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const delta = deltas[e.key];
    const pos = positions[activeIndex];
    if (!delta || !pos) return;
    e.preventDefault();
    moveLayer(activeIndex, pos.x + delta[0] / size.width, pos.y + delta[1] / size.height);
  };

  return (
    <div className="projector">
      <div className="projector-controls">
        <button onClick={align} disabled={images.length === 0}>
          Align layers
        </button>
        <button onClick={scatter} disabled={images.length === 0}>
          Scatter
        </button>
      </div>
      <div
        className="projector-container"
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <canvas className="projector-canvas" ref={canvasRef} />
        {positions.map((pos, i) => (
          <div
            key={i}
            className="projector-handle"
            style={{
              left: `${pos.x * 100}%`,
              top: `${pos.y * 100}%`,
              width: `${LAYER_WIDTH * 100}%`,
              height: `${layerHeightFraction * 100}%`,
              zIndex: i === activeIndex ? 2 : 1,
            }}
            onPointerDown={handlePointerDown(i)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        ))}
        {images.length === 0 && <div className="projector-loading">Loading…</div>}
      </div>
    </div>
  );
}
