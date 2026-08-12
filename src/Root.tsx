import React from 'react';
import {Composition, Still} from 'remotion';
import {
	CAROUSEL_HEIGHT,
	CAROUSEL_WIDTH,
	CarruselEducativoZAS,
	TOTAL_SLIDES,
} from './CarruselEducativoZAS';
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
			{Array.from({length: TOTAL_SLIDES}, (_, slideIndex) => (
				<Still
					key={slideIndex}
					id={`CarruselEducativoZAS-${slideIndex + 1}`}
					component={CarruselEducativoZAS}
					width={CAROUSEL_WIDTH}
					height={CAROUSEL_HEIGHT}
					defaultProps={{slideIndex}}
				/>
			))}
		</>
	);
};
