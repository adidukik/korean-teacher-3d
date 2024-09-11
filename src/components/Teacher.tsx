import { useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

interface TeacherProps {
  teacher: string;
  position?: Vector3 | [number, number, number];
  scale?: number;
  'rotation-y'?: number;
}

export const teachers = ['Yerin', 'Haneul'];

export default function Teacher({ teacher, ...props }: TeacherProps) {
  const { scene } = useGLTF(`/models/Teacher_${teacher}.glb`);
  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
}

teachers.forEach((teacher) => {
  useGLTF.preload(`/models/Teacher_${teacher}.glb`);
});
