import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls, Environment } from '@react-three/drei';
import { CommonComponentProps } from '../../interface';
import * as THREE from 'three';

/**
 * @description 3D模型查看器 - 琅琊楼模型
 */
function LangYa({ id, styles }: CommonComponentProps) {
	const divRef = useRef<HTMLDivElement>(null);
	const modelPath = '/models/langya_pavilion/langya_pavilion.glb';

	// 阻止Canvas区域的拖拽冒泡
	const handleCanvasPointerDown = (e: React.PointerEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			ref={divRef}
			data-component-id={id}
			className='w-full h-[500px] relative cursor-move'
			style={{ ...styles, userSelect: 'none' }}
		>
			<Canvas
				camera={{ position: [10, 5, 10], fov: 30 }}
				style={{ position: 'absolute' }}
				onPointerDown={handleCanvasPointerDown}
				onPointerUp={handleCanvasPointerDown}
			>
				<ambientLight intensity={0.8} />
				<pointLight position={[10, 10, 10]} intensity={1.5} />
				<directionalLight position={[-5, 5, 5]} intensity={1} castShadow />
				<Suspense fallback={<Fallback />}>
					<Model modelPath={modelPath} />
					<Environment preset='city' />
				</Suspense>
				<OrbitControls
					enableZoom={true}
					enablePan={true}
					enableRotate={true}
					minDistance={1}
					maxDistance={5}
				/>
			</Canvas>
		</div>
	);
}

// 模型加载组件
const Model = ({ modelPath }: { modelPath: string }) => {
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
		if (modelRef.current && gltf.animations && gltf.animations.length > 0) {
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
			gltf.scene.position.set(0, -1, 0); // y轴从-2调整为0，使模型位置更高
			gltf.scene.rotation.set(-0.1, -3, -0.1);
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

export default LangYa;
