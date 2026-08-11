import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from './theme';
import {BoltIcon} from './Logo';

// ============================================================================
// Fondo dinámico reutilizable (sin video, solo marca): gradientes de color
// en movimiento, líneas de velocidad y un rayo gigante de marca de agua.
// Zoom Ken Burns continuo + "punch" de zoom en cada corte de escena.
// Lo usan tanto FelizInicioSemanaZAS como UsaZasApp.
// ============================================================================

export const DynamicBackground: React.FC<{cutFrames: number[]}> = ({cutFrames}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const opacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Zoom lento y constante durante todo el video.
	const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.15]);

	// Pequeño "golpe" de zoom en cada corte de escena para que se sienta dinámico.
	const punch = cutFrames.reduce((max, cutFrame) => {
		const value = interpolate(frame, [cutFrame, cutFrame + 12], [0.07, 0], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
		return Math.max(max, value);
	}, 0);

	// Manchas de luz (glow) que derivan lentamente en círculos, con los tres
	// colores del rayo de ZAS.
	const glow1X = 50 + Math.sin(frame / 75) * 20;
	const glow1Y = 32 + Math.cos(frame / 95) * 14;
	const glow2X = 50 + Math.cos(frame / 65) * 24;
	const glow2Y = 66 + Math.sin(frame / 85) * 16;

	return (
		<AbsoluteFill style={{opacity, backgroundColor: COLORS.brandNavy}}>
			<AbsoluteFill style={{transform: `scale(${kenBurns + punch})`}}>
				<AbsoluteFill
					style={{
						background: `radial-gradient(circle at ${glow1X}% ${glow1Y}%, #3FDC8C4D 0%, transparent 45%),
							radial-gradient(circle at ${glow2X}% ${glow2Y}%, #3B8CE84D 0%, transparent 50%),
							radial-gradient(circle at 50% 105%, #F7E24B26 0%, transparent 55%)`,
					}}
				/>
				<SpeedLines />
				<BoltWatermark />
			</AbsoluteFill>
			{/* Viñeta para que el texto resalte sobre el fondo. */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 45%, transparent 40%, ${COLORS.brandNavy}CC 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};

// Líneas diagonales que se desplazan continuamente, sugiriendo velocidad.
const SpeedLines: React.FC = () => {
	const frame = useCurrentFrame();
	const offset = (frame * 5) % 180;

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					inset: '-60%',
					transform: `rotate(-14deg) translateX(${-offset}px)`,
					backgroundImage:
						'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 3px, transparent 3px, transparent 100px)',
				}}
			/>
		</AbsoluteFill>
	);
};

// Rayo gigante y tenue detrás de todo, como marca de agua que respira.
const BoltWatermark: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const rotate = interpolate(frame, [0, durationInFrames], [-6, 6]);
	const pulse = 1 + Math.sin(frame / 28) * 0.03;

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 0.14}}>
			<div style={{transform: `rotate(${rotate}deg) scale(${pulse * 3.4})`}}>
				<BoltIcon size={260} />
			</div>
		</AbsoluteFill>
	);
};
