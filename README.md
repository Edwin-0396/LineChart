# Line Chart Widget for Mendix

A customizable line chart widget for visualizing telemetry data (pressure, vibration, and voltage) with interactive toggling capabilities.

![Line Chart Example](assets/line-chart-example.png)

## Features

- **Interactive Data Visualization**: Display time-series data with smooth curves
- **Toggle Metrics**: Show/hide individual metrics (pressure, vibration, volt)
- **Responsive Design**: Adapts to different screen sizes
- **Tooltips**: Hover over data points to see detailed values
- **Customizable Height**: Set chart height based on your needs

## Usage

1. Add the LineChart widget to your Mendix page
2. Configure the following properties:
   - **Data Source**: Select the Telemetry entity containing your telemetry data
   - **DateTime Attribute**: Select the DateTime attribute for the x-axis
   - **Pressure Attribute**: Select the Pressure attribute for pressure values
   - **Vibration Attribute**: Select the Vibration attribute for vibration values
   - **Volt Attribute**: Select the Volt attribute for voltage values
   - **Chart Height**: Set the desired height in pixels (default: 400)

## Data Requirements

Your Telemetry entity should contain:
- A DateTime attribute for the timestamp
- Decimal attributes for Pressure, Vibration, and Volt values

## Development

### Prerequisites
- Node.js
- NPM

### Building the widget
```bash
npm install
npm run build
```

### Testing
```bash
npm run test
```

## Support

For issues or feature requests, please create an issue in the repository.

## License

This widget is licensed under the MIT License.
