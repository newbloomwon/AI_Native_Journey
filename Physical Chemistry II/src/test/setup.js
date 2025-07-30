import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock for Canvas and WebGL context since we're testing React Three Fiber components
global.HTMLCanvasElement.prototype.getContext = () => {
  return {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Array(4),
    })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => []),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  };
};

// Mock for ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Simple mocks for React Three Fiber and related libraries
vi.mock('@react-three/fiber', () => {
  return {
    Canvas: ({ children }) => React.createElement('div', { 'data-testid': 'canvas' }, children),
    useFrame: vi.fn((callback) => callback()),
    useThree: vi.fn(() => ({
      camera: {},
      scene: {},
      gl: {},
    })),
  };
});

vi.mock('@react-three/drei', () => {
  return {
    OrbitControls: () => React.createElement('div', { 'data-testid': 'orbit-controls' }),
  };
});

vi.mock('three', () => {
  return {
    Group: class Group {
      add() {}
      remove() {}
    },
    Vector3: class Vector3 {
      constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
    },
    Mesh: class Mesh {},
    SphereGeometry: class SphereGeometry {},
    MeshStandardMaterial: class MeshStandardMaterial {},
    CylinderGeometry: class CylinderGeometry {},
    MathUtils: {
      degToRad: (deg) => deg * (Math.PI / 180),
    },
    Quaternion: class Quaternion {
      setFromAxisAngle() {}
    },
  };
});