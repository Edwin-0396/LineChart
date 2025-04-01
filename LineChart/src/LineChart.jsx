import { createElement, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import "./ui/LineChart.css";

// Registrar los componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function LineChart({ telemetryData, title, dataAttribute }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (telemetryData && telemetryData.status === "available" && telemetryData.items && telemetryData.items.length > 0) {
            console.log("Processing telemetry data...");
            
            try {
                // Accedemos a los datos según la estructura específica que vimos en la depuración
                const items = telemetryData.items.map(item => {
                    // Encontrar la propiedad Symbol(mxObject)
                    const symbolKeys = Object.getOwnPropertySymbols(item);
                    const mxObjectSymbol = symbolKeys.find(s => String(s).includes('mxObject'));
                    
                    if (!mxObjectSymbol || !item[mxObjectSymbol] || !item[mxObjectSymbol]._jsonData) {
                        return null;
                    }
                    
                    // Si tenemos _jsonData y attributes, devolver los atributos
                    return item[mxObjectSymbol]._jsonData.attributes || null;
                }).filter(Boolean); // Filtrar elementos nulos
                
                if (items.length === 0) {
                    setError("Could not extract data from Mendix objects");
                    return;
                }
                
                // Verificar la estructura del primer elemento con datos
                console.log("Atributos extraídos:", items[0]);
                
                // Extraer fechas usando el atributo DateTime - SOLO NOMBRES DE MESES
                const labels = items.map(attrs => {
                    if (!attrs.DateTime || attrs.DateTime.value === undefined) {
                        return "";
                    }
                    
                    try {
                        // Convertir el timestamp a fecha y obtener solo el nombre del mes
                        const timestamp = attrs.DateTime.value;
                        const date = new Date(timestamp);
                        return date.toLocaleDateString('en-US', { month: 'long' });
                    } catch (e) {
                        console.warn("Error al analizar fecha:", attrs.DateTime.value, e);
                        return "";
                    }
                }).filter(Boolean);
                
                if (labels.length === 0) {
                    setError("No valid dates could be extracted from the data");
                    return;
                }
                
                // Crear datasets basados en el atributo solicitado o todos ellos
                const datasets = [];
                const attributes = ["Volt", "Rotate", "Pressure", "Vibration"];
                
                if (dataAttribute && dataAttribute.value && dataAttribute.value !== "all") {
                    // Buscar el atributo específico (capitalizar la primera letra para coincidir con Mendix)
                    const attr = dataAttribute.value.charAt(0).toUpperCase() + dataAttribute.value.slice(1);
                    
                    if (items[0][attr] !== undefined) {
                        const dataset = createDatasetFromAttribute(attr, items);
                        if (dataset) {
                            datasets.push(dataset);
                        } else {
                            setError(`No valid data could be extracted for attribute '${attr}'`);
                        }
                    } else {
                        setError(`Attribute '${attr}' is not available in the data`);
                    }
                } else {
                    // Crear datasets para todos los atributos disponibles
                    attributes.forEach(attr => {
                        if (items[0][attr] !== undefined) {
                            const dataset = createDatasetFromAttribute(attr, items);
                            if (dataset) {
                                datasets.push(dataset);
                            }
                        }
                    });
                }
                
                if (datasets.length > 0) {
                    setChartData({ labels, datasets });
                    setError(null);
                } else {
                    setError("No charts could be created with the available data");
                }
            } catch (err) {
                console.error("Error processing data:", err);
                setError("Error processing data: " + err.message);
            }
        }
    }, [telemetryData, dataAttribute]);
    
    // Función para crear un dataset a partir de un atributo
    function createDatasetFromAttribute(attributeName, items) {
        const data = items.map(attrs => {
            if (!attrs[attributeName] || attrs[attributeName].value === undefined) {
                return null;
            }
            
            // Obtener el valor y convertirlo a número si es necesario
            const value = attrs[attributeName].value;
            return typeof value === 'number' ? value : parseFloat(value);
        });
        
        // Solo crear dataset si hay valores válidos
        if (data.some(val => val !== null && !isNaN(val))) {
            return {
                label: attributeName,
                data: data,
                borderColor: getColorForAttribute(attributeName),
                backgroundColor: "transparent",
                tension: 0.3
            };
        }
        return null;
    }
    
    // Función para asignar colores consistentes a cada atributo
    function getColorForAttribute(attribute, alpha = 1) {
        const attrLower = attribute.toLowerCase();
        const colors = {
            volt: `rgba(54, 162, 235, ${alpha})`,
            rotate: `rgba(255, 99, 132, ${alpha})`,
            pressure: `rgba(75, 192, 192, ${alpha})`,
            vibration: `rgba(255, 159, 64, ${alpha})`
        };
        return colors[attrLower] || `rgba(201, 203, 207, ${alpha})`;
    }
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top"
            },
            title: {
                display: title ? true : false, // Solo mostrar el título si se proporciona uno
                text: title || ""
            }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    };
    
    return (
        <div className="line-chart-container" style={{ height: "400px", width: "100%" }}>
            {error ? (
                <div className="error" style={{ 
                    textAlign: "center", 
                    padding: "20px", 
                    color: "#d32f2f",
                    border: "1px solid #d32f2f",
                    borderRadius: "4px",
                    margin: "10px",
                    backgroundColor: "#ffebee"
                }}>
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            ) : loading ? (
                <div className="loading" style={{ textAlign: "center", padding: "20px" }}>
                    Loading data...
                </div>
            ) : chartData.datasets.length > 0 ? (
                <Line data={chartData} options={options} />
            ) : (
                <div className="no-data" style={{ textAlign: "center", padding: "20px" }}>
                    No valid data to display. Please check your data structure.
                </div>
            )}
        </div>
    );
}
