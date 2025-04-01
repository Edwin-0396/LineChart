import "./ui/LineChart.css";
import { createElement, useEffect, useRef } from "react";
import { Chart } from "@antv/g2";

/**
 * LineChart Component - Simplified version - ONLY VOLT
 */
export function LineChart(props) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstance.current) {
            chartInstance.current = new Chart({
                container: chartRef.current,
                autoFit: true,
                height: props.height || 400,
                padding: [40, 40, 50, 50]
            });
        }

        const chart = chartInstance.current;

        if (!props.dataSource?.items?.length) {
            console.warn("No items in data source");
            showEmptyMessage(chart);
            return;
        }

        try {
            // Log complete structure of first item to understand its format
            const firstItem = props.dataSource.items[0];
            console.log("Complete first item:", firstItem);

            // Find all properties and symbols in the object
            console.log("All direct properties:", Object.keys(firstItem));
            console.log(
                "All symbols:",
                Object.getOwnPropertySymbols(firstItem).map(s => String(s))
            );

            // Direct approach to extract data - ONLY VOLT
            const data = extractTelemetryData(props.dataSource.items);
            console.log("Extracted data points (Volt Only):", data);

            if (data.length === 0) {
                console.warn("No data points could be extracted");
                showEmptyMessage(chart);
                return;
            }

            renderLineChart(chart, data);
        } catch (error) {
            console.error("Error processing data:", error);
            showEmptyMessage(chart);
        }

        // eslint-disable-next-line consistent-return
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [props.dataSource, props.height]);

    /**
     * Extract telemetry data - ONLY VOLT
     */
    function extractTelemetryData(items) {
        const result = [];

        items.forEach((item, index) => {
            try {
                // Get the primary internal object
                const primaryMxObject = findMxObject(item);
                // console.log(
                //     `Item ${index} - Primary MxObject found:`,
                //     primaryMxObject ? Object.keys(primaryMxObject) : null
                // ); // Keep logs minimal for now

                if (!primaryMxObject) {
                    console.warn(`Item ${index}: Could not find any internal MxObject`);
                    return;
                }

                // Determine the object that actually holds the attribute values
                let dataHoldingObject = primaryMxObject;
                if (primaryMxObject._mxObject && typeof primaryMxObject._mxObject.get === "function") {
                    dataHoldingObject = primaryMxObject._mxObject;
                } else if (typeof primaryMxObject.get !== "function") {
                    console.warn(`Item ${index}: Data object lacks .get method. Access might fail.`);
                }

                // Find attribute IDs - ONLY VOLT and TIME
                // const dateAttrId = findAttributeId(dataHoldingObject, /datetime|date|time|attr.*_9/i); // Keep date ID (removed unused var warning)
                const voltAttrId = findAttributeId(dataHoldingObject, /volt|attr.*_6/i);

                console.log(`Item ${index} identified IDs for get():`, { voltAttrId }); // Simplified log

                // Get values - careful with parsing
                const timestamp = new Date();
                timestamp.setDate(timestamp.getDate() + index); // Use generated date

                // Function to safely get numeric value
                const getNumericValue = (obj, attrId, metricName) => {
                    if (!attrId) {
                        console.warn(`Item ${index}: No attribute ID found for ${metricName}`);
                        return null; // Return null instead of 0 if ID not found
                    }

                    let rawValue;
                    if (obj && typeof obj.get === "function") {
                        try {
                            rawValue = obj.get(attrId);
                            // console.log(`Item ${index} - ${metricName} - Value from obj.get(${attrId}):`, rawValue); // Keep logs minimal
                        } catch (e) {
                            console.error(`Item ${index} - Error calling obj.get(${attrId})`, e);
                            rawValue = undefined;
                        }
                    }
                    if (rawValue === undefined) {
                        rawValue = obj[attrId];
                    }

                    let valueToParse = rawValue;
                    if (rawValue && typeof rawValue === "object" && rawValue.value !== undefined) {
                        valueToParse = rawValue.value;
                    }

                    const parsedValue = parseFloat(valueToParse);
                    return isNaN(parsedValue) ? null : parsedValue; // Return null if NaN
                };

                const volt = getNumericValue(dataHoldingObject, voltAttrId, "Volt");

                console.log(`Item ${index} FINAL parsed values:`, { timestamp: timestamp.toString(), volt });

                // Add data points ONLY FOR VOLT if valid
                if (volt !== null) {
                    // Check for null explicitly
                    result.push({
                        timestamp,
                        value: volt,
                        metric: "Volt"
                    });
                }
            } catch (error) {
                console.error(`Error processing item ${index}:`, error);
            }
        });

        return result;
    }

    /**
     * Find the Mendix object that likely has the .get method or attributes.
     */
    function findMxObject(item) {
        const symbols = Object.getOwnPropertySymbols(item);
        for (const sym of symbols) {
            if (String(sym).includes("mxObject") || String(sym).includes("$")) {
                const obj = item[sym];
                if (obj) {
                    if (obj._mxObject && typeof obj._mxObject.get === "function") {
                        return obj._mxObject;
                    }
                    return obj;
                }
            }
        }
        if (typeof item.get === "function" || item.attributes) return item;
        const attrKeys = Object.keys(item).filter(k => k.startsWith("attr_"));
        if (attrKeys.length > 0) return item;
        for (const key in item) {
            if (typeof item[key] === "object" && item[key] !== null) {
                const nestedObj = item[key];
                if (typeof nestedObj.get === "function" || Object.keys(nestedObj).some(k => k.startsWith("attr_"))) {
                    return nestedObj;
                }
            }
        }
        return item;
    }

    /**
     * Find attribute ID matching a pattern - ONLY VOLT and TIME
     */
    function findAttributeId(mxObj, pattern) {
        if (!mxObj) return null;
        const keys = Object.keys(mxObj);
        for (const key of keys) {
            if (pattern.test(key)) return key;
        }
        // Fallback to hardcoded IDs
        console.warn(`Pattern ${pattern} did not match any key. Falling back to hardcoded ID.`);
        if (pattern.test("datetime")) return "attr_kpq_9"; // Keep time for potential use
        if (pattern.test("volt")) return "attr_kpq_6";
        return null;
    }

    function showEmptyMessage(chart) {
        chart.clear();
        chart.annotation().text({
            position: ["50%", "50%"],
            content: "No data available",
            style: { fontSize: 14, fill: "#999", textAlign: "center" }
        });
        chart.render();
    }

    function renderLineChart(chart, data) {
        chart.clear();
        const validData = data.filter(
            d =>
                d.timestamp instanceof Date &&
                !isNaN(d.timestamp.getTime()) &&
                typeof d.value === "number" &&
                !isNaN(d.value)
        );
        if (validData.length !== data.length) {
            console.warn("Some extracted data points were invalid.", {
                original: data.length,
                valid: validData.length
            });
        }
        validData.sort((a, b) => a.timestamp - b.timestamp);
        console.log("Data being sent to chart (Volt Only):", validData);
        chart.data(validData);

        // Simplified colors
        const colors = { Volt: "#32CD32" };

        chart.scale({
            timestamp: { type: "time", tickCount: 6, mask: "MMM DD" },
            value: { nice: true, min: 0 }
        });
        chart.axis("timestamp", {
            title: null,
            line: { style: { stroke: "#E8E8E8", lineWidth: 1 } },
            tickLine: { style: { stroke: "#E8E8E8", lineWidth: 1 } },
            label: { style: { fontSize: 12, fill: "#666" } }
        });
        chart.axis("value", {
            title: null,
            grid: { line: { style: { stroke: "#E8E8E8", lineWidth: 1 } } },
            label: { style: { fontSize: 12, fill: "#666" } }
        });
        chart
            .line()
            .position("timestamp*value")
            .color("metric", metric => colors[metric])
            .shape("smooth")
            .size(2);
        chart
            .point()
            .position("timestamp*value")
            .color("metric", metric => colors[metric])
            .shape("circle")
            .size(4)
            .style({ stroke: "#fff", lineWidth: 1 });
        chart.tooltip({ showCrosshairs: true, shared: true });
        chart.legend({
            position: "top",
            marker: { symbol: "line", style: { lineWidth: 2 } },
            itemName: { style: { fontSize: 12, fill: "#666" } }
        });
        chart.render();
    }

    // Simplified UI
    return (
        <div className="line-chart-container" style={{ width: "100%", overflow: "hidden" }}>
            <div ref={chartRef} style={{ width: "100%", height: props.height || "400px" }}></div>
        </div>
    );
}
