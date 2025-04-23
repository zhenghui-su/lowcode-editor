import { Canvas, useLoader } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '@react-three/drei';
import { CommonComponentProps } from '../../interface';

// 类型定义
interface ModelViewerProps extends CommonComponentProps {
	modelPath: string;
	scale?: number;
	cameraPosition?: [number, number, number];
}

// 模型加载组件
const Model = ({ modelPath }: { modelPath: string }) => {
	const gltf = useLoader(GLTFLoader, modelPath);
	return <primitive object={gltf.scene} scale={0.5} />;
};

// 容器组件
const ModelViewer = ({
	id,
	styles,
	modelPath,
	// scale = 1,
	cameraPosition = [2, 2, 2],
}: ModelViewerProps) => {
	const divRef = useRef<HTMLDivElement>(null);
	const controlsRef = useRef<any>(null);

	// 阻止Canvas区域的拖拽冒泡
	const handleCanvasPointerDown = (e: React.PointerEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			ref={divRef}
			data-component-id={id}
			className='w-full h-[400px] relative cursor-move'
			style={{ ...styles, userSelect: 'none' }}
		>
			<Canvas
				camera={{ position: cameraPosition, fov: 45 }}
				style={{ position: 'absolute' }}
				onPointerDown={handleCanvasPointerDown}
				onPointerUp={handleCanvasPointerDown}
			>
				<ambientLight intensity={5} />
				<pointLight position={[10, 10, 10]} />
				<Suspense fallback={<Fallback />}>
					<Model modelPath={modelPath} />
				</Suspense>
				<OrbitControls ref={controlsRef} enableZoom={true} enablePan={false} />
			</Canvas>
		</div>
	);
};

// 加载状态组件
const Fallback = () => {
	return (
		<mesh position={[0, 0, 0]}>
			<sphereGeometry args={[0.5, 32, 32]} />
			<meshStandardMaterial color='hotpink' />
		</mesh>
	);
};

export default ModelViewer;
