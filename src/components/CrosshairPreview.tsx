import type { CrosshairSettings } from "../types/loadout";

interface Props {
  crosshair: CrosshairSettings;
  size?: number;
}

/**
 * Render the generated crosshair using absolutely positioned divs. Coordinates
 * are computed relative to the center of the preview box to mirror how the
 * in-game editor composes inner lines, outer lines, and the center dot.
 */
export function CrosshairPreview({ crosshair, size = 220 }: Props) {
  const center = size / 2;
  const outlineStyle = crosshair.outlines
    ? `0 0 0 ${crosshair.outlineThickness}px rgba(0,0,0,${crosshair.outlineOpacity})`
    : "none";

  const lineStyle = (
    showLine: boolean,
    opacity: number,
    thickness: number,
    length: number,
    offset: number,
    orientation: "horizontal" | "vertical",
    direction: 1 | -1,
  ): React.CSSProperties => {
    if (!showLine || length === 0 || thickness === 0)
      return { display: "none" };
    const common: React.CSSProperties = {
      position: "absolute",
      background: crosshair.color,
      opacity,
      boxShadow: outlineStyle,
    };
    if (orientation === "horizontal") {
      const width = length;
      return {
        ...common,
        width,
        height: thickness,
        top: center - thickness / 2,
        left: direction === 1 ? center + offset : center - offset - width,
      };
    }
    const height = length;
    return {
      ...common,
      width: thickness,
      height,
      left: center - thickness / 2,
      top: direction === 1 ? center + offset : center - offset - height,
    };
  };

  const dotStyle: React.CSSProperties = crosshair.centerDot
    ? {
        position: "absolute",
        width: crosshair.centerDotThickness,
        height: crosshair.centerDotThickness,
        background: crosshair.color,
        opacity: crosshair.centerDotOpacity,
        left: center - crosshair.centerDotThickness / 2,
        top: center - crosshair.centerDotThickness / 2,
        boxShadow: outlineStyle,
        borderRadius: 1,
      }
    : { display: "none" };

  return (
    <div
      className="crosshair-preview"
      style={{ width: size, height: size, position: "relative" }}
      aria-label="Crosshair preview"
    >
      {/* Inner lines */}
      <div
        style={lineStyle(
          crosshair.innerLines.show,
          crosshair.innerLines.opacity,
          crosshair.innerLines.thickness,
          crosshair.innerLines.length,
          crosshair.innerLines.offset,
          "horizontal",
          1,
        )}
      />
      <div
        style={lineStyle(
          crosshair.innerLines.show,
          crosshair.innerLines.opacity,
          crosshair.innerLines.thickness,
          crosshair.innerLines.length,
          crosshair.innerLines.offset,
          "horizontal",
          -1,
        )}
      />
      <div
        style={lineStyle(
          crosshair.innerLines.show,
          crosshair.innerLines.opacity,
          crosshair.innerLines.thickness,
          crosshair.innerLines.verticalLength,
          crosshair.innerLines.offset,
          "vertical",
          1,
        )}
      />
      <div
        style={lineStyle(
          crosshair.innerLines.show,
          crosshair.innerLines.opacity,
          crosshair.innerLines.thickness,
          crosshair.innerLines.verticalLength,
          crosshair.innerLines.offset,
          "vertical",
          -1,
        )}
      />

      {/* Outer lines */}
      <div
        style={lineStyle(
          crosshair.outerLines.show,
          crosshair.outerLines.opacity,
          crosshair.outerLines.thickness,
          crosshair.outerLines.length,
          crosshair.outerLines.offset,
          "horizontal",
          1,
        )}
      />
      <div
        style={lineStyle(
          crosshair.outerLines.show,
          crosshair.outerLines.opacity,
          crosshair.outerLines.thickness,
          crosshair.outerLines.length,
          crosshair.outerLines.offset,
          "horizontal",
          -1,
        )}
      />
      <div
        style={lineStyle(
          crosshair.outerLines.show,
          crosshair.outerLines.opacity,
          crosshair.outerLines.thickness,
          crosshair.outerLines.verticalLength,
          crosshair.outerLines.offset,
          "vertical",
          1,
        )}
      />
      <div
        style={lineStyle(
          crosshair.outerLines.show,
          crosshair.outerLines.opacity,
          crosshair.outerLines.thickness,
          crosshair.outerLines.verticalLength,
          crosshair.outerLines.offset,
          "vertical",
          -1,
        )}
      />

      <div style={dotStyle} />
    </div>
  );
}
