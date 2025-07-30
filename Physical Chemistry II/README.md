# Molecular Dynamics Visualization

A web application for visualizing atom and molecule interactions to facilitate a better understanding of physical chemistry concepts.

## Overview

This application helps students visualize chemical reactions and molecular interactions through interactive 3D models. It uses molecular dynamics simulations to show how atoms and molecules interact over time, making abstract chemistry concepts more tangible and easier to understand.

## Features

- **Interactive 3D Visualization**: View molecules and atoms in a 3D environment with the ability to rotate, zoom, and pan.
- **Multiple Reaction Types**: Choose from various reaction types including SN2 reactions, acid-base reactions, and redox reactions.
- **Step-by-Step Visualization**: See each step of a chemical reaction with detailed explanations.
- **Educational Information**: Each reaction step includes key points, energy changes, and detailed descriptions.
- **Playback Controls**: Play through reactions automatically or step through them manually.

## Technology Stack

- **React**: Frontend framework
- **Three.js**: 3D rendering library
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers for React Three Fiber

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select a reaction type from the dropdown menu
2. Use the playback controls to step through the reaction or play it automatically
3. Read the information panel to understand what's happening at each step
4. Interact with the 3D model to view the molecules from different angles

## Future Enhancements

- Add more reaction types and molecular interactions
- Implement custom molecule builder
- Add energy diagrams for reactions
- Support for more complex molecular dynamics simulations
- Integration with external molecular dynamics data sources

## License

ISC