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
			className='w-full h-[500px] relative cursor-move'
			style={{ ...styles, userSelect: 'none' }}
		>
			<Canvas
				camera={{ position: [10, 5, 10], fov: 45 }}
				style={{ position: 'absolute' }}
				onPointerDown={handleCanvasPointerDown}
				onPointerUp={handleCanvasPointerDown}
			>
				<ambientLight intensity={0.8} />
				<pointLight position={[10, 10, 10]} intensity={1.5} />
				<directionalLight position={[-5, 5, 5]} intensity={1} castShadow />
				<Suspense fallback={<Fallback />}>
					<TokyoModel modelPath={modelPath} isRotating={isRotating} />
					<Environment preset='city' />
				</Suspense>
				<OrbitControls
					enableZoom={true}
					enablePan={true}
					enableRotate={true}
					minDistance={5}
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

	// 启用模型自带的动画
	useFrame(({ clock }) => {
		if (
			modelRef.current &&
			gltf.animations &&
			gltf.animations.length > 0 &&
			isRotating
		) {
			// 使用模型自带的动画，而不是手动旋转
			const mixer = new THREE.AnimationMixer(modelRef.current);
			const action = mixer.clipAction(gltf.animations[0]);
			action.play();
			mixer.update(clock.getDelta());
		}
	});

	useEffect(() => {
		if (gltf && gltf.scene) {
			// 调整模型位置和比例 - 位置更高
			gltf.scene.position.set(0, 0, 0); // y轴从-2调整为0，使模型位置更高

			// 为模型添加阴影
			gltf.scene.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
		}
	}, [gltf]);

	return <primitive ref={modelRef} object={gltf.scene} scale={0.01} />;
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
