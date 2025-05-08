import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls, Environment } from '@react-three/drei';
import { CommonComponentProps } from '../../interface';
import * as THREE from 'three';

/**
 * @description 3D模型查看器 - 东京模型
 */
function ThreeDViewer({ id, styles }: CommonComponentProps) {
	const divRef = useRef<HTMLDivElement>(null);
	const [isRotating, setIsRotating] = useState(true);
	const modelPath = '/models/LittlestTokyo/LittlestTokyo.glb';
	const controlsRef = useRef<any>(null);
	const [size, setSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	// 处理窗口大小调整
	useEffect(() => {
		const handleResize = () => {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// 更新控制器
	useFrame(() => {
		if (controlsRef.current) {
			controlsRef.current.update();
		}
	});

	// 阻止Canvas区域的拖拽冒泡
	const handleCanvasPointerDown = (e: React.PointerEvent) => {
		e.stopPropagation();
	};

	// 切换旋转状态
	const toggleRotation = () => {
		setIsRotating(!isRotating);
	};

	return (
		<div
			ref={divRef}
			data-component-id={id}
			className='w-full h-[500px] relative'
			style={{ ...styles, userSelect: 'none' }}
		>
			<Canvas
				camera={{ position: [5, 2, 8], fov: 40 }}
				style={{ position: 'absolute', background: '#bfe3dd' }}
				onPointerDown={handleCanvasPointerDown}
				onPointerUp={handleCanvasPointerDown}
			>
				<color attach='background' args={['#bfe3dd']} />
				<ambientLight intensity={0.8} />
				<pointLight position={[10, 10, 10]} intensity={1.5} />
				<directionalLight position={[-5, 5, 5]} intensity={1} castShadow />
				<Suspense fallback={<Fallback />}>
					<TokyoModel modelPath={modelPath} isRotating={isRotating} />
					<Environment preset='city' />
				</Suspense>
				<OrbitControls
					ref={controlsRef}
					enableZoom={true}
					enablePan={false}
					enableRotate={true}
					enableDamping={true}
					target={[0, 0.5, 0]}
					minDistance={1}
					maxDistance={20}
				/>
			</Canvas>
			<div className='absolute bottom-4 left-4 z-10'>
				<button
					onClick={toggleRotation}
					className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
				>
					{isRotating ? '暂停旋转' : '开始旋转'}
				</button>
			</div>
			<div className='absolute top-4 left-4 z-10 text-xs text-gray-700'>
				<p>Model: Littlest Tokyo by Glen Fox, CC Attribution</p>
			</div>
		</div>
	);
}

// 东京模型加载组件
const TokyoModel = ({
	modelPath,
	isRotating,
}: {
	modelPath: string;
	isRotating: boolean;
}) => {
	// 创建并配置DRACOLoader
	const dracoLoader = new DRACOLoader();
	// 设置DRACO解码器路径 - 使用CDN或本地路径
	dracoLoader.setDecoderPath(
		'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
	);
	// 设置解码配置
	dracoLoader.setDecoderConfig({ type: 'js' });

	// 创建GLTFLoader并设置DRACOLoader
	const gltfLoader = new GLTFLoader();
	gltfLoader.setDRACOLoader(dracoLoader);

	// 使用配置好的loader加载模型
	const gltf = useLoader(GLTFLoader, modelPath, (loader) => {
		// 确保每个loader实例都有DRACOLoader
		(loader as GLTFLoader).setDRACOLoader(dracoLoader);
	});

	const modelRef = useRef<THREE.Group>();
	const mixerRef = useRef<THREE.AnimationMixer>();
	const actionRef = useRef<THREE.AnimationAction>();
	const clockRef = useRef<THREE.Clock>(new THREE.Clock());

	// 初始化动画混合器和动作
	useEffect(() => {
		if (gltf && gltf.scene && gltf.animations && gltf.animations.length > 0) {
			// 调整模型位置和比例
			gltf.scene.position.set(1, 1, 0); // 与原示例保持一致
			gltf.scene.scale.set(0.01, 0.01, 0.01);

			// 为模型添加阴影
			gltf.scene.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});

			// 创建动画混合器 - 只创建一次
			if (!mixerRef.current) {
				mixerRef.current = new THREE.AnimationMixer(gltf.scene);
				actionRef.current = mixerRef.current.clipAction(gltf.animations[0]);
				// 初始状态下播放动画
				if (isRotating) {
					actionRef.current.play();
				}
			}
		}

		return () => {
			// 清理动画混合器
			if (mixerRef.current) {
				mixerRef.current.stopAllAction();
				mixerRef.current = undefined;
			}
		};
	}, [gltf, isRotating]);

	// 控制动画播放/暂停
	useEffect(() => {
		if (actionRef.current) {
			if (isRotating) {
				actionRef.current.play();
			} else {
				actionRef.current.stop();
			}
		}
	}, [isRotating]);

	// 更新动画
	useFrame(() => {
		if (mixerRef.current && isRotating) {
			const delta = clockRef.current.getDelta();
			mixerRef.current.update(delta);
		}
	});

	return <primitive ref={modelRef} object={gltf.scene} />;
};

// 加载状态组件
const Fallback = () => {
	return (
		<mesh position={[0, 0, 0]}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color='#3f88f4' wireframe />
		</mesh>
	);
};

export default ThreeDViewer;
