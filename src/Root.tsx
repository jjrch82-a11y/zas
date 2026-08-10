import React from 'react';
import {Composition} from 'remotion';
import {
	DURATION_IN_FRAMES,
	FPS,
	FelizInicioSemanaZAS,
	VIDEO_HEIGHT,
	VIDEO_WIDTH,
} from './FelizInicioSemanaZAS';

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
		</>
	);
};
