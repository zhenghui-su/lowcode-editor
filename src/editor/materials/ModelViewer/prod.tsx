import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '@react-three/drei';
import { CommonComponentProps } from '../../interface';
import * as THREE from 'three';

// 类型定义
interface ModelViewerProps extends CommonComponentProps {
	modelPath: string;
	scale?: number;
	cameraPosition?: [number, number, number];
}

// 模型加载组件
const Model = ({
	modelPath,
	isRotating,
}: {
	modelPath: string;
	isRotating: boolean;
}) => {
	const gltf = useLoader(GLTFLoader, modelPath);
	const modelRef = useRef<THREE.Group>();

	// 添加自动旋转动画，仅在isRotating为true时旋转
	useFrame(() => {
		if (modelRef.current && isRotating) {
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
	const [isRotating, setIsRotating] = useState(true);

	// 阻止Canvas区域的拖拽冒泡
	const handleCanvasPointerDown = (e: React.PointerEvent) => {
		e.stopPropagation();
		setIsRotating(false); // 用户交互时停止旋转
	};

	// 监听控制器变化，当用户停止交互一段时间后恢复旋转
	useEffect(() => {
		if (controlsRef.current) {
			const controls = controlsRef.current;

			const handleControlEnd = () => {
				// 用户交互结束后延迟1秒恢复旋转
				setTimeout(() => setIsRotating(true), 1000);
			};

			controls.addEventListener('end', handleControlEnd);
			return () => {
				controls.removeEventListener('end', handleControlEnd);
			};
		}
	}, [controlsRef.current]);

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
					<Model modelPath={modelPath} isRotating={isRotating} />
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
