import { useState } from "react";
import "./IterationStepper.css";

interface Step {
  label: string;
  rows: { src: string; caption: string }[][];
}

interface IterationStepperProps {
  steps: Step[];
}

export default function IterationStepper({ steps }: IterationStepperProps) {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const progress = steps.length > 1 ? current / (steps.length - 1) : 0;

  return (
    <div className="iteration-stepper">
      <div
        className="iteration-slider"
        style={{ "--progress": progress } as React.CSSProperties}
      >
        <span className="iteration-bubble">{step.label}</span>
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={current}
          onChange={(e) => setCurrent(Number(e.target.value))}
          aria-label="Iteration"
          aria-valuetext={step.label}
        />
      </div>
      {step.rows.map((row, i) => (
        <div
          key={i}
          className="iteration-images"
          style={{ "--columns": row.length } as React.CSSProperties}
        >
          {row.map((image) => (
            <figure key={image.caption}>
              <img src={image.src} alt={image.caption} />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      ))}
    </div>
  );
}
