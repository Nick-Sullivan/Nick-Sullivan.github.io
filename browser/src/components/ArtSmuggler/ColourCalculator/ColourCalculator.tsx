import { useState, useEffect } from "react";
import "./ColourCalculator.css";

interface RGBValues {
  r: number;
  g: number;
  b: number;
}

interface ColourCalculatorProps {
  initialValues?: Array<{ r: number; g: number; b: number }>;
  isEditable?: boolean;
}

export default function ColourCalculator({
  initialValues,
  isEditable = true,
}: ColourCalculatorProps) {
  const defaultValues = initialValues || [
    { r: 100, g: 100, b: 0 },
    { r: 0, g: 100, b: 100 },
  ];

  const [images, setImages] = useState<RGBValues[]>(defaultValues);
  const [result, setResult] = useState<RGBValues>({ r: 0, g: 100, b: 0 });

  useEffect(() => {
    // Multiply all image RGB values together
    let resultR = 100;
    let resultG = 100;
    let resultB = 100;

    images.forEach((img) => {
      resultR = (resultR / 100) * (img.r / 100) * 100;
      resultG = (resultG / 100) * (img.g / 100) * 100;
      resultB = (resultB / 100) * (img.b / 100) * 100;
    });

    setResult({
      r: Math.round(resultR),
      g: Math.round(resultG),
      b: Math.round(resultB),
    });
  }, [images]);

  const rgbToString = (rgb: RGBValues) =>
    `rgb(${Math.round(rgb.r * 2.55)}, ${Math.round(rgb.g * 2.55)}, ${Math.round(
      rgb.b * 2.55
    )})`;

  const rgbToHex = (rgb: RGBValues) =>
    "#" +
    [rgb.r, rgb.g, rgb.b]
      .map((x) => {
        const hex = Math.round(x * 2.55).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");

  const hexToRgb = (hex: string): RGBValues => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: Math.round(parseInt(result[1], 16) / 2.55),
          g: Math.round(parseInt(result[2], 16) / 2.55),
          b: Math.round(parseInt(result[3], 16) / 2.55),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const updateImage = (
    index: number,
    channel: "r" | "g" | "b",
    value: number
  ) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [channel]: value };
    setImages(newImages);
  };

  const handleColorPicker = (index: number, hex: string) => {
    const rgb = hexToRgb(hex);
    const newImages = [...images];
    newImages[index] = rgb;
    setImages(newImages);
  };

  const getSliderColor = (value: number, channel: "r" | "g" | "b") => {
    const intensity = Math.round(value * 2.55);
    switch (channel) {
      case "r":
        return `rgb(${intensity}, 0, 0)`;
      case "g":
        return `rgb(0, ${intensity}, 0)`;
      case "b":
        return `rgb(0, 0, ${intensity})`;
    }
  };

  return (
    <div className="colour-calculator">
      <table>
        <thead>
          <tr>
            <th>Red</th>
            <th>Green</th>
            <th>Blue</th>
            <th>Colour</th>
          </tr>
        </thead>
        <tbody>
          {images.map((img, index) => (
            <tr key={index}>
              <td>
                {isEditable ? (
                  <>
                    <input
                      type="range"
                      className="slider-red"
                      min="0"
                      max="100"
                      value={img.r}
                      onChange={(e) =>
                        updateImage(index, "r", parseInt(e.target.value))
                      }
                      style={{ backgroundColor: getSliderColor(img.r, "r") }}
                    />
                    <span>{img.r}%</span>
                  </>
                ) : (
                  <span>{img.r}%</span>
                )}
              </td>
              <td>
                {isEditable ? (
                  <>
                    <input
                      type="range"
                      className="slider-green"
                      min="0"
                      max="100"
                      value={img.g}
                      onChange={(e) =>
                        updateImage(index, "g", parseInt(e.target.value))
                      }
                      style={{ backgroundColor: getSliderColor(img.g, "g") }}
                    />
                    <span>{img.g}%</span>
                  </>
                ) : (
                  <span>{img.g}%</span>
                )}
              </td>
              <td>
                {isEditable ? (
                  <>
                    <input
                      type="range"
                      className="slider-blue"
                      min="0"
                      max="100"
                      value={img.b}
                      onChange={(e) =>
                        updateImage(index, "b", parseInt(e.target.value))
                      }
                      style={{ backgroundColor: getSliderColor(img.b, "b") }}
                    />
                    <span>{img.b}%</span>
                  </>
                ) : (
                  <span>{img.b}%</span>
                )}
              </td>
              <td>
                <div className="color-box-wrapper">
                  {isEditable ? (
                    <input
                      type="color"
                      className="color-input"
                      value={rgbToHex(img)}
                      onChange={(e) => handleColorPicker(index, e.target.value)}
                      title="Click to choose color"
                    />
                  ) : (
                    <div
                      className="color-box"
                      style={{ backgroundColor: rgbToString(img) }}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
          <tr className="result-row">
            <td className="result-value">{result.r}%</td>
            <td className="result-value">{result.g}%</td>
            <td className="result-value">{result.b}%</td>
            <td>
              <div
                className="color-box"
                style={{ backgroundColor: rgbToString(result) }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
