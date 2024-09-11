'use client';

import { Canvas } from '@react-three/fiber';
import {
  CameraControls,
  Environment,
  Gltf,
  Html,
  OrbitControls,
} from '@react-three/drei';
// import Teacher from './Teacher';
import TypingBox from './TypingBox';
import { useAITeacher } from '@/hooks/useAITeacher';
import { degToRad } from 'three/src/math/MathUtils.js';
import { MessagesList } from './MessagesList';

export default function Experience() {
  const teacher = useAITeacher((state: any) => state.teacher);
  const classroom = useAITeacher((state: any) => state.classroom);
  return (
    <>
      <div className='z-10 md:justify-center fixed bottom-4 left-4 right-4 flex gap-3 flex-wrap justify-stretch'>
        <TypingBox />
      </div>
      <Canvas
        camera={{
          position: [0, 0, 0.0001],
        }}
      >
        <CameraManager />
        <Environment preset='sunset' />
        <ambientLight intensity={0.8} color='pink' />
        <Html position={[0.22, 0.192, -3]} transform distanceFactor={0.5}>
          <MessagesList />
        </Html>
        {/* <Teacher
          teacher={teacher}
          position={[-1, -1.7, -3]}
          scale={1.5}
          rotation-y={degToRad(20)}
        /> */}
        <Gltf src='/models/classroom_default.glb' position={[0.2, -1.7, -2]} />
      </Canvas>
    </>
  );
}

function CameraManager() {
  return (
    <CameraControls
      minZoom={1}
      maxZoom={3}
      polarRotateSpeed={-0.3} // Reverse for natural effect
      azimuthRotateSpeed={-0.3} // Reverse for natural effect
      mouseButtons={{
        left: 1, // ACTION.ROTATE
        middle: 0,
        right: 0,
        wheel: 16, // ACTION.ZOOM
      }}
      touches={{
        one: 32, // ACTION.TOUCH_ROTATE
        two: 512, // ACTION.TOUCH_ZOOM
        three: 0,
      }}
    />
  );
}
