import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * Procedural, colourful 3D fox in a yellow hard hat. It bobs, blinks, wags its
 * tail, waves, follows the pointer with its head and jumps when tapped.
 * Hex values are used here because three.js materials do not read CSS tokens.
 */
const COLORS = {
  fur: "#ff8a1f",
  furDark: "#c4540a",
  cream: "#fff1dc",
  pink: "#ff8fa8",
  eye: "#1b1226",
  hat: "#ffd21f",
  hatBand: "#ff4d3d",
  shoe: "#5b2a12",
};

function Mat({ color, rough = 0.45 }: { color: string; rough?: number }) {
  return <meshPhysicalMaterial color={color} roughness={rough} clearcoat={0.5} clearcoatRoughness={0.35} />;
}

function Eye({ x, blink }: { x: number; blink: React.RefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.scale.y = blink.current ?? 1;
  });
  return (
    <group ref={ref} position={[x, 0.08, 0.8]}>
      <mesh scale={[1, 1.15, 0.7]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.1]} scale={[1, 1.1, 0.7]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color={COLORS.eye} roughness={0.15} />
      </mesh>
      <mesh position={[0.04, 0.06, 0.18]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Fox({ onTap }: { onTap: () => void }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const arm = useRef<THREE.Group>(null);
  const blink = useRef(1);
  const nextBlink = useRef(2);
  const jump = useRef(0);
  const [hover, setHover] = useState(false);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (root.current) {
      const j = jump.current;
      root.current.position.y = Math.sin(t * 1.6) * 0.06 + Math.sin(Math.min(j, 1) * Math.PI) * 0.7;
      const squash = 1 + Math.sin(Math.min(j, 1) * Math.PI * 2) * -0.06;
      root.current.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, state.pointer.x * 0.35 + (j > 0 && j < 1 ? j * Math.PI * 2 : 0), 0.1);
      if (j > 0) jump.current = j + dt * 1.8 >= 1 ? 0 : j + dt * 1.8;
    }
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, state.pointer.x * 0.5, 0.08);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -state.pointer.y * 0.3, 0.08);
      head.current.rotation.z = Math.sin(t * 1.2) * 0.04;
    }
    if (tail.current) tail.current.rotation.y = Math.sin(t * 5) * 0.5;
    if (arm.current) arm.current.rotation.z = -2.2 + Math.sin(t * 6) * 0.35;

    nextBlink.current -= dt;
    if (nextBlink.current <= 0) {
      blink.current = 0.08;
      if (nextBlink.current < -0.12) {
        nextBlink.current = 1.5 + Math.random() * 2.5;
      }
    } else {
      blink.current = 1;
    }
  });

  const tap = () => {
    if (jump.current === 0) jump.current = 0.001;
    onTap();
  };

  return (
    <group
      ref={root}
      position={[0, -0.2, 0]}
      onClick={tap}
      onPointerOver={() => {
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
      scale={hover ? 1.03 : 1}
    >
      {/* Body */}
      <mesh position={[0, -0.55, 0]} scale={[1, 1.05, 0.9]}>
        <sphereGeometry args={[0.8, 48, 48]} />
        <Mat color={COLORS.fur} />
      </mesh>
      <mesh position={[0, -0.6, 0.45]} scale={[0.8, 0.95, 0.5]}>
        <sphereGeometry args={[0.6, 40, 40]} />
        <Mat color={COLORS.cream} rough={0.6} />
      </mesh>

      {/* Feet */}
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, -1.3, 0.35]} scale={[1, 0.55, 1.35]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <Mat color={COLORS.shoe} />
        </mesh>
      ))}

      {/* Arms: left rests, right waves */}
      <mesh position={[-0.85, -0.55, 0.1]} rotation={[0, 0, 0.35]} scale={[0.6, 1.2, 0.6]}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <Mat color={COLORS.fur} />
      </mesh>
      <group ref={arm} position={[0.75, -0.3, 0.1]}>
        <mesh position={[0, -0.3, 0]} scale={[0.6, 1.2, 0.6]}>
          <sphereGeometry args={[0.24, 24, 24]} />
          <Mat color={COLORS.fur} />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <sphereGeometry args={[0.15, 20, 20]} />
          <Mat color={COLORS.cream} />
        </mesh>
      </group>

      {/* Tail */}
      <group ref={tail} position={[0, -1.0, -0.65]}>
        <mesh position={[0, 0.15, -0.5]} rotation={[0.5, 0, 0]} scale={[0.75, 0.75, 1.7]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <Mat color={COLORS.fur} />
        </mesh>
        <mesh position={[0, 0.5, -1.0]} scale={[0.7, 0.7, 0.9]}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <Mat color={COLORS.cream} />
        </mesh>
      </group>

      {/* Head */}
      <group ref={head} position={[0, 0.62, 0.05]}>
        <mesh scale={[1.12, 0.95, 0.98]}>
          <sphereGeometry args={[0.85, 56, 56]} />
          <Mat color={COLORS.fur} />
        </mesh>
        {/* cheeks fluff */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.62, -0.25, 0.3]} scale={[0.9, 0.7, 0.8]} rotation={[0, 0, s * 0.4]}>
            <sphereGeometry args={[0.38, 28, 28]} />
            <Mat color={COLORS.cream} rough={0.6} />
          </mesh>
        ))}
        {/* muzzle */}
        <mesh position={[0, -0.25, 0.62]} scale={[1.05, 0.72, 0.85]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <Mat color={COLORS.cream} rough={0.6} />
        </mesh>
        <mesh position={[0, -0.08, 0.98]} scale={[1.2, 0.85, 0.9]}>
          <sphereGeometry args={[0.1, 20, 20]} />
          <meshStandardMaterial color={COLORS.eye} roughness={0.2} />
        </mesh>
        {/* smile */}
        <mesh position={[0, -0.34, 0.96]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.13, 0.018, 12, 28, Math.PI]} />
          <meshStandardMaterial color={COLORS.eye} />
        </mesh>
        {/* blush */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.52, -0.12, 0.74]} scale={[1, 0.65, 0.3]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={COLORS.pink} roughness={0.8} />
          </mesh>
        ))}
        <Eye x={-0.36} blink={blink} />
        <Eye x={0.36} blink={blink} />
        {/* ears */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.68, 0.62, -0.1]} rotation={[0, 0, -s * 0.42]}>
            <mesh>
              <coneGeometry args={[0.34, 0.8, 32]} />
              <Mat color={COLORS.fur} />
            </mesh>
            <mesh position={[0, -0.04, 0.1]} scale={[0.6, 0.65, 0.5]}>
              <coneGeometry args={[0.34, 0.8, 32]} />
              <Mat color={COLORS.pink} rough={0.7} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <Mat color={COLORS.furDark} />
            </mesh>
          </group>
        ))}
        {/* hard hat */}
        <group position={[0, 0.7, 0.08]} rotation={[-0.12, 0, 0.06]}>
          <mesh>
            <sphereGeometry args={[0.52, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Mat color={COLORS.hat} rough={0.3} />
          </mesh>
          <mesh position={[0, 0.01, 0.1]} scale={[1, 0.3, 1.2]}>
            <cylinderGeometry args={[0.6, 0.6, 0.06, 40]} />
            <Mat color={COLORS.hat} rough={0.3} />
          </mesh>
          <mesh position={[0, 0.2, 0.3]} rotation={[0.6, 0, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <Mat color={COLORS.hatBand} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function FoxMascot3D({ onTap }: { onTap: () => void }) {
  const dpr = useMemo<[number, number]>(() => [1, 2], []);
  return (
    <Canvas dpr={dpr} camera={{ position: [0, 0.2, 5.6], fov: 34 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} />
      <directionalLight position={[-4, 2, -2]} intensity={0.8} color="#9ec5ff" />
      <Environment resolution={256}>
        <Lightformer intensity={2.5} position={[0, 5, 2]} scale={[10, 10, 1]} />
        <Lightformer intensity={1.2} color="#ffd9b0" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
        <Lightformer intensity={1.2} color="#b0d0ff" position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} />
      </Environment>
      <Fox onTap={onTap} />
      <ContactShadows position={[0, -1.55, 0]} opacity={0.55} scale={6} blur={2.6} far={3} />
    </Canvas>
  );
}
