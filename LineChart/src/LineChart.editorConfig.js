/**
 * @typedef Property
 * @type {object}
 * @property {string} key
 * @property {string} caption
 * @property {string} description
 * @property {string[]} objectHeaders
 * @property {ObjectProperties[]} objects
 * @property {Properties[]} properties
 */

/**
 * @typedef ObjectProperties
 * @type {object}
 * @property {PropertyGroup[]} properties
 * @property {string[]} captions
 */

/**
 * @typedef PropertyGroup
 * @type {object}
 * @property {string} caption
 * @property {PropertyGroup[]} propertyGroups
 * @property {Property[]} properties
 */

/**
 * @typedef Properties
 * @type {PropertyGroup}
 */

/**
 * @typedef Problem
 * @type {object}
 * @property {string} property
 * @property {("error" | "warning" | "deprecation")} severity
 * @property {string} message
 * @property {string} studioMessage
 * @property {string} url
 * @property {string} studioUrl
 */

/**
 * @param {object} values
 * @param {Properties} defaultProperties
 * @param {("web"|"desktop")} target
 * @returns {Properties}
 */
export function getProperties(values, defaultProperties, target) {
    // Configurar las propiedades para nuestro componente LineChart
    if (!defaultProperties.properties) {
        defaultProperties.properties = [];
    }
    
    defaultProperties.properties.push({
        key: "telemetryData",
        caption: "Telemetry Data",
        description: "Datasource with telemetry information",
        objectHeaders: ["Datetime", "MachineID", "Volt", "Rotate", "Pressure", "Vibration"],
        propertyGroupType: "datasource",
        required: true
    });
    
    defaultProperties.properties.push({
        key: "title",
        caption: "Chart Title",
        description: "The title displayed above the chart",
        propertyGroupType: "string"
    });
    
    defaultProperties.properties.push({
        key: "dataAttribute",
        caption: "Data Attribute",
        description: "Select specific attribute to display",
        propertyGroupType: "enumeration",
        enumerationValues: {
            "": "All",
            "volt": "Volt",
            "rotate": "Rotate",
            "pressure": "Pressure",
            "vibration": "Vibration"
        }
    });
    
    return defaultProperties;
}

/**
 * @param {object} values
 * @returns {object}
 */
export function getPreview(values, isDarkMode) {
    return {
        type: "Container",
        backgroundColor: isDarkMode ? "#252525" : "#fff",
        children: [
            {
                type: "Text",
                content: "Line Chart Preview - " + (values.title || "Telemetry Data")
            }
        ]
    };
}

/**
 * @param {Object} values
 * @returns {Problem[]} returns a list of problems.
 */
export function check(values) {
    const errors = [];
    
    if (!values.telemetryData) {
        errors.push({
            property: "telemetryData",
            message: "A data source is required for the chart",
            severity: "error"
        });
    }
    
    return errors;
}

// /**
//  * @param {Object} values
//  * @param {boolean} isDarkMode
//  * @param {number[]} version
//  * @returns {object}
//  */
// export function getPreview(values, isDarkMode, version) {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     };
// }

// /**
//  * @param {Object} values
//  * @param {("web"|"desktop")} platform
//  * @returns {string}
//  */
// export function getCustomCaption(values, platform) {
//     return "LineChart";
// }
