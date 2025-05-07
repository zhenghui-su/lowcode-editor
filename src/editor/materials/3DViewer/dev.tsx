import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useEffect, useState, useCallback } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
	OrbitControls,
	useProgress,
	Html,
	Environment,
	ContactShadows,
} from '@react-three/drei';
import { CommonComponentProps } from '../../interface';
import { useDrag } from 'react-dnd';
import * as THREE from 'three';

// 类型定义
interface ModelViewerProps extends CommonComponentProps {
	modelPath: string;
	scale?: number;
	cameraPosition?: [number, number, number];
	autoRotate?: boolean;
	autoRotateSpeed?: number;
	minDistance?: number;
	maxDistance?: number;
	enableEnvironment?: boolean;
	enableShadows?: boolean;
}

// 加载进度指示器组件
const LoadingIndicator = () => {
	const { progress } = useProgress();
	return (
		<Html center>
			<div
				className='loading-container'
				style={{ width: '150px', textAlign: 'center' }}
			>
				<div
					className='progress-bar'
					style={{
						width: '100%',
						height: '10px',
						background: '#f0f0f0',
						borderRadius: '5px',
						overflow: 'hidden',
						marginBottom: '10px',
					}}
				>
					<div
						style={{
							width: `${progress}%`,
							height: '100%',
							background: 'royalblue',
							transition: 'width 0.3s ease-in-out',
						}}
					/>
				</div>
				<div style={{ fontSize: '14px', color: '#333' }}>
					加载中... {progress.toFixed(0)}%
				</div>
			</div>
		</Html>
	);
};

// 模型加载组件 - 使用缓存机制
const modelCache = new Map();

const Model = ({
	modelPath,
	scale = 0.5,
}: {
	modelPath: string;
	scale?: number;
}) => {
	const [error, setError] = useState<string | null>(null);
	const modelRef = useRef<THREE.Group>(null);

	// 使用缓存加载模型
	const gltf = useLoader(
		GLTFLoader,
		modelPath,
		(loader) => {
			// 添加加载器配置，如需要可以在这里设置
			loader.setCrossOrigin('anonymous');
		},
		(error) => {
			console.error('模型加载错误:', error);
			setError('模型加载失败，请检查路径或模型格式');
		},
	);

	// 自动旋转效果
	useFrame(() => {
		if (modelRef.current && modelCache.get('autoRotate')) {
			modelRef.current.rotation.y += modelCache.get('autoRotateSpeed') * 0.01;
		}
	});

	// 如果发生错误，显示错误信息
	if (error) {
		return (
			<Html center>
				<div
					style={{
						padding: '20px',
						background: 'rgba(255,0,0,0.1)',
						border: '1px solid red',
						borderRadius: '5px',
						color: 'red',
					}}
				>
					{error}
				</div>
			</Html>
		);
	}

	return <primitive ref={modelRef} object={gltf.scene} scale={scale} />;
};

// 容器组件
const All3DModelViewer = ({
	id,
	styles,
	modelPath,
	scale = 0.5,
	cameraPosition = [2, 2, 2],
	autoRotate = false,
	autoRotateSpeed = 1,
	minDistance = 1,
	maxDistance = 10,
	enableEnvironment = true,
	enableShadows = true,
}: ModelViewerProps) => {
	const divRef = useRef<HTMLDivElement>(null);
	const controlsRef = useRef<any>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);

	// 拖拽功能
	const [_, drag] = useDrag({
		type: 'ModelViewer',
		item: {
			type: 'ModelViewer',
			dragType: 'move',
			id: id,
		},
	});

	// 更新模型缓存中的配置
	useEffect(() => {
		modelCache.set('autoRotate', autoRotate);
		modelCache.set('autoRotateSpeed', autoRotateSpeed);
	}, [autoRotate, autoRotateSpeed]);

	useEffect(() => {
		drag(divRef);
	}, [drag]);

	// 阻止Canvas区域的拖拽冒泡
	const handleCanvasPointerDown = useCallback((e: React.PointerEvent) => {
		e.stopPropagation();
	}, []);

	// 切换全屏显示
	const toggleFullscreen = useCallback(() => {
		setIsFullscreen((prev) => !prev);
	}, []);

	return (
		<div
			ref={divRef}
			data-component-id={id}
			className={`relative cursor-move ${
				isFullscreen
					? 'fixed top-0 left-0 w-screen h-screen z-50'
					: 'w-full h-[400px]'
			}`}
			style={{ ...styles, userSelect: 'none' }}
		>
			{/* 控制按钮 */}
			<div className='absolute top-2 right-2 z-10 flex gap-2'>
				<button
					className='bg-white/80 hover:bg-white p-1 rounded shadow-md transition-colors'
					onClick={toggleFullscreen}
					style={{ fontSize: '12px', padding: '4px 8px' }}
				>
					{isFullscreen ? '退出全屏' : '全屏查看'}
				</button>
			</div>

			<Canvas
				camera={{ position: cameraPosition, fov: 45 }}
				style={{ position: 'absolute' }}
				onPointerDown={handleCanvasPointerDown}
				onPointerUp={handleCanvasPointerDown}
				shadows={enableShadows}
				gl={{ antialias: true, alpha: true }}
				// pixelRatio={window.devicePixelRatio}
			>
				{/* 改进的光照效果 */}
				<ambientLight intensity={1.5} />
				<pointLight
					position={[10, 10, 10]}
					intensity={1}
					castShadow={enableShadows}
				/>
				<directionalLight
					position={[-5, 5, 5]}
					intensity={0.5}
					castShadow={enableShadows}
					shadow-mapSize-width={1024}
					shadow-mapSize-height={1024}
				/>

				{/* 模型加载 */}
				<Suspense
					fallback={
						<>
							<LoadingIndicator />
							<Fallback />
						</>
					}
				>
					<Model modelPath={modelPath} scale={scale} />
					{enableEnvironment && (
						<Environment preset='apartment' background={false} />
					)}
					{enableShadows && (
						<ContactShadows
							opacity={0.5}
							scale={10}
							blur={1}
							far={10}
							resolution={256}
						/>
					)}
				</Suspense>

				{/* 增强的控制器 */}
				<OrbitControls
					ref={controlsRef}
					enableZoom={true}
					enablePan={false}
					autoRotate={autoRotate}
					autoRotateSpeed={autoRotateSpeed}
					minDistance={minDistance}
					maxDistance={maxDistance}
					enableDamping={true}
					dampingFactor={0.05}
				/>
			</Canvas>
		</div>
	);
};

// 加载状态组件
const Fallback = () => {
	const meshRef = useRef<THREE.Mesh>(null);

	// 添加旋转动画
	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.rotation.x += 0.01;
			meshRef.current.rotation.y += 0.01;
		}
	});

	return (
		<mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
			<boxGeometry args={[0.7, 0.7, 0.7]} />
			<meshStandardMaterial color='royalblue' metalness={0.5} roughness={0.5} />
		</mesh>
	);
};

export default All3DModelViewer;
