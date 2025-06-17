import { Object3D, Mesh } from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      boxGeometry: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
    }
  }
}

export interface ThreeElements {
  mesh: Object3D;
  sphereGeometry: any;
  boxGeometry: any;
  meshStandardMaterial: any;
}

export type MeshRef = Mesh;
