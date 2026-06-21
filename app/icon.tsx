import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Pizza circle */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Outer crust */}
        <div style={{
          width: "22px", height: "22px", borderRadius: "50%",
          background: "#c2410c",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Inner cheese */}
          <div style={{
            width: "17px", height: "17px", borderRadius: "50%",
            background: "#fbbf24",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Sauce dots */}
            <div style={{ display: "flex", gap: "3px" }}>
              <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#dc2626" }} />
              <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#dc2626" }} />
            </div>
          </div>
        </div>
        {/* Slice divider lines */}
        <div style={{
          position: "absolute",
          width: "22px", height: "1px",
          background: "#c2410c", opacity: 0.6,
          transform: "rotate(45deg)",
        }} />
        <div style={{
          position: "absolute",
          width: "22px", height: "1px",
          background: "#c2410c", opacity: 0.6,
          transform: "rotate(-45deg)",
        }} />
      </div>
    </div>,
    { ...size }
  );
}
