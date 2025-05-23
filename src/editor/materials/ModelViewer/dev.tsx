import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '@react-three/drei';
import { CommonComponentProps } from '../../interface';
import { useDrag } from 'react-dnd';
import * as THREE from 'three';

// 类型定义
interface ModelViewerProps extends CommonComponentProps {
	modelPath: string;
	scale?: number;
	cameraPosition?: [number, number, number];
}

// 模型加载组件
const Model = ({ modelPath }: { modelPath: string }) => {
	const gltf = useLoader(GLTFLoader, modelPath);
	const modelRef = useRef<THREE.Group>();

	// 添加自动旋转动画
	useFrame(() => {
		if (modelRef.current) {
			modelRef.current.rotation.y += 0.005; // 控制旋转速度
		}
	});

	return <primitive ref={modelRef} object={gltf.scene} scale={0.5} />;
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

	// 拖拽功能
	const [_, drag] = useDrag({
		type: 'ModelViewer',
		item: {
			type: 'ModelViewer',
			dragType: 'move',
			id: id,
		},
	});

	useEffect(() => {
		drag(divRef);
	}, [drag]);

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
				<OrbitControls
					ref={controlsRef}
					enableZoom={true}
					enablePan={false}
					enableRotate={false} // 禁用旋转，只允许缩放
				/>
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
