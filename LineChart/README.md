# Line Chart Widget for Mendix

A customizable line chart widget for visualizing telemetry data (pressure, vibration, and voltage) with interactive toggling capabilities.

![Line Chart Example](line-chart-example.png)

## Features

- **Interactive Data Visualization:** Display time-series data with smooth curves
- **Toggle Metrics:** Show/hide individual metrics (pressure, vibration, volt)
- **Responsive Design:** Adapts to different screen sizes
- **Tooltips:** Hover over data points to see detailed values
- **Customizable Height:** Set chart height based on your needs.

## Usage

1. Add the LineChart widget to your Mendix page
2. Configure the following properties:
   - **Data Source:** Select a data source with telemetry information
   - **Data Attribute:** Choose which attribute to display (or select 'All' to show all)

## Development

### Prerequisites
- Node.js (>=16)
- NPM (>=6)
- Mendix Studio Pro 9+

### Building the widget
1. Clone this repository

## Demo project
[link to sandbox]

## Issues, suggestions and feature requests
[link to GitHub issues]

## Development and contribution

1. Install NPM package dependencies by using: `npm install`. If you use NPM v7.x.x, which can be checked by executing `npm -v`, execute: `npm install --legacy-peer-deps`.
1. Run `npm start` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.

[specify contribution]
