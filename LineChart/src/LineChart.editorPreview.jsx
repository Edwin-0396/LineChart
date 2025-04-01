import { createElement } from "react";

export function preview({ telemetryData, dataAttribute }) {
    return (
        <div style={{ 
            width: "100%", 
            height: "300px", 
            display: "flex", 
            flexDirection: "column",
            justifyContent: "center", 
            alignItems: "center",
            border: "1px dashed #ccc",
            borderRadius: "4px",
            color: "#555",
            background: "#f5f5f5"
        }}>
            <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
                Line Chart Preview
            </div>
            <div style={{ 
                width: "80%", 
                height: "150px", 
                background: "white", 
                border: "1px solid #ddd",
                borderRadius: "4px",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Blue example line */}
                <div style={{ 
                    position: "absolute", 
                    bottom: "30px", 
                    left: "0", 
                    width: "100%", 
                    height: "60px", 
                    borderTop: "2px solid #3498db", 
                    background: "rgba(52, 152, 219, 0.1)" 
                }}></div>
                
                {/* Green example line */}
                <div style={{ 
                    position: "absolute", 
                    bottom: "40px", 
                    left: "0", 
                    width: "100%", 
                    height: "40px", 
                    borderTop: "2px solid #2ecc71", 
                    background: "rgba(46, 204, 113, 0.1)" 
                }}></div>
                
                {/* Orange example line */}
                <div style={{ 
                    position: "absolute", 
                    bottom: "20px", 
                    left: "0", 
                    width: "100%", 
                    height: "60px", 
                    borderTop: "2px solid #e67e22", 
                    background: "rgba(230, 126, 34, 0.1)" 
                }}></div>
                
                {/* Example months */}
                <div style={{ 
                    position: "absolute", 
                    bottom: "5px", 
                    left: "0", 
                    width: "100%", 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "0 10px",
                    fontSize: "10px",
                    color: "#777"
                }}>
                    <span>January</span>
                    <span>February</span>
                    <span>March</span>
                    <span>April</span>
                    <span>May</span>
                    <span>June</span>
                </div>
            </div>
            <div style={{ fontSize: "12px", marginTop: "10px", color: "#777" }}>
                {dataAttribute && dataAttribute.value && dataAttribute.value !== "all" 
                    ? `Showing: ${dataAttribute.value}`
                    : "Showing all telemetry data"}
            </div>
        </div>
    );
}

export function getPreviewCss() {
    return require("./ui/LineChart.css");
}
