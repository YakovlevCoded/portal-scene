import { useRef } from "react";
import {
  Center,
  OrbitControls,
  useGLTF,
  useTexture,
  Sparkles,
  shaderMaterial,
} from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";

import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";
import * as THREE from "three";

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#ff00ff"),
    uColorEnd: new THREE.Color("#00ffff"),
  },
  portalVertexShader,
  portalFragmentShader
);

extend({ PortalMaterial });

export default function Experience() {
  const { nodes } = useGLTF("./model/portal.glb");
  const bakedTexture = useTexture("./model/baked.jpg");

  const portalMaterial = useRef();

  useFrame(({ clock }) => {
    portalMaterial.current.uniforms.uTime.value = clock.getElapsedTime() * 3;
  });

  return (
    <>
      <color args={["#030202"]} attach="background" />

      <OrbitControls makeDefault />

      <Center>
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} map-flipY={false} />
        </mesh>
        <mesh
          geometry={nodes.poleLightA.geometry}
          position={nodes.poleLightA.position}
        ></mesh>
        <mesh
          geometry={nodes.poleLightB.geometry}
          position={nodes.poleLightB.position}
        ></mesh>

        <mesh
          geometry={nodes.portalLight.geometry}
          position={nodes.portalLight.position}
          rotation={nodes.portalLight.rotation}
        >
          <portalMaterial ref={portalMaterial} />
        </mesh>

        <Sparkles
          size={6}
          scale={[4, 2, 4]}
          position-y={1}
          count={40}
          speed={0.5}
        />
      </Center>
    </>
  );
}
