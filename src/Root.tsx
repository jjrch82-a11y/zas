import React from 'react';
import {Composition} from 'remotion';
import {
	DURATION_IN_FRAMES,
	FPS,
	FelizInicioSemanaZAS,
	VIDEO_HEIGHT,
	VIDEO_WIDTH,
} from './FelizInicioSemanaZAS';
import {APP_DURATION_IN_FRAMES, APP_FPS, APP_HEIGHT, APP_WIDTH, UsaZasApp} from './UsaZasApp';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="FelizInicioSemanaZAS"
				component={FelizInicioSemanaZAS}
				durationInFrames={DURATION_IN_FRAMES}
				fps={FPS}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
			<Composition
				id="UsaZasApp"
				component={UsaZasApp}
				durationInFrames={APP_DURATION_IN_FRAMES}
				fps={APP_FPS}
				width={APP_WIDTH}
				height={APP_HEIGHT}
			/>
		</>
	);
};
