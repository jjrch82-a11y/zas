import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Loop,
	OffthreadVideo,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {
	BACKGROUND_VIDEO_DURATION_IN_FRAMES,
	BACKGROUND_VIDEO_SRC,
	COLORS,
	GooglePlayBadge,
} from './FelizInicioSemanaZAS';
import {BoltIcon, ZasLogoLockup} from './Logo';

// ============================================================================
// CONFIGURACIÓN EDITABLE — cambia esto para reusar la plantilla.
// ============================================================================

export const APP_FPS = 30;
export const APP_DURATION_IN_FRAMES = 300; // 10s a 30fps, ritmo rápido/dinámico
export const APP_WIDTH = 1080;
export const APP_HEIGHT = 1920;

export const APP_AUDIO = {
	music: 'bg-music.mp3', // cama rítmica de 10s, sincronizada con la duración total
	whoosh: 'whoosh.mp3', // sonido de transición entre escenas
};

export const APP_TEXTS = {
	mainTitle: 'Usa la App de ZAS',
	features: [
		{emoji: '⚡', label: 'Fácil'},
		{emoji: '🚀', label: 'Rápida'},
		{emoji: '🛡️', label: 'Segura'},
	],
	ctaTitle: 'Descárgala en la Play Store',
	ctaBadge: 'Disponible en Google Play',
	website: 'zasapps.com',
};

// Timing de cada escena, en frames (30fps).
export const APP_SCENES = {
	logo: {from: 0, durationInFrames: 45}, // 0-1.5s
	tagline: {from: 45, durationInFrames: 90}, // 1.5-4.5s
	features: {from: 135, durationInFrames: 90}, // 4.5-7.5s
	cta: {from: 225, durationInFrames: 75}, // 7.5-10s
};

const CUT_FRAMES = [
	APP_SCENES.logo.from,
	APP_SCENES.tagline.from,
	APP_SCENES.features.from,
	APP_SCENES.cta.from,
];

// ============================================================================
// COMPOSICIÓN PRINCIPAL
// ============================================================================

export const UsaZasApp: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.brandBlack}}>
			<ZoomingBackground />

			<Audio src={staticFile(APP_AUDIO.music)} volume={0.55} />
			{CUT_FRAMES.map((cutFrame) => (
				<Sequence key={cutFrame} from={cutFrame} durationInFrames={20}>
					<Audio src={staticFile(APP_AUDIO.whoosh)} volume={0.7} />
				</Sequence>
			))}

			<Sequence from={APP_SCENES.logo.from} durationInFrames={APP_SCENES.logo.durationInFrames}>
				<LogoScene />
			</Sequence>

			<Sequence
				from={APP_SCENES.tagline.from}
				durationInFrames={APP_SCENES.tagline.durationInFrames}
			>
				<TaglineScene />
			</Sequence>

			<Sequence
				from={APP_SCENES.features.from}
				durationInFrames={APP_SCENES.features.durationInFrames}
			>
				<FeaturesScene />
			</Sequence>

			<Sequence from={APP_SCENES.cta.from} durationInFrames={APP_SCENES.cta.durationInFrames}>
				<CtaScene />
			</Sequence>
		</AbsoluteFill>
	);
};

// ============================================================================
// FONDO CON ZOOM (Ken Burns continuo + "punch" en cada corte de escena)
// ============================================================================

const ZoomingBackground: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const opacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Zoom lento y constante durante todo el video.
	const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.2]);

	// Pequeño "golpe" de zoom en cada corte de escena para que se sienta dinámico.
	const punch = CUT_FRAMES.reduce((max, cutFrame) => {
		const value = interpolate(frame, [cutFrame, cutFrame + 12], [0.06, 0], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
		return Math.max(max, value);
	}, 0);

	return (
		<AbsoluteFill style={{opacity}}>
			<AbsoluteFill style={{transform: `scale(${kenBurns + punch})`}}>
				<Loop durationInFrames={BACKGROUND_VIDEO_DURATION_IN_FRAMES}>
					<OffthreadVideo
						src={staticFile(BACKGROUND_VIDEO_SRC)}
						muted
						style={{width: '100%', height: '100%', objectFit: 'cover'}}
					/>
				</Loop>
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					background: `linear-gradient(180deg, ${COLORS.brandNavy}D9 0%, ${COLORS.brandNavy}66 25%, ${COLORS.brandNavy}66 70%, ${COLORS.brandNavy}F0 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};

// ============================================================================
// ESCENA 1: LOGO (0-1.5s)
// ============================================================================

const LogoScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 9, stiffness: 140, mass: 0.6}});
	const opacity = interpolate(entrance, [0, 1], [0, 1]);
	const scale = interpolate(entrance, [0, 1], [0.4, 1]);

	const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{opacity: opacity * fadeOut, transform: `scale(${scale})`}}>
				<ZasLogoLockup iconSize={200} wordmarkSize={150} showTagline={false} />
			</div>
		</AbsoluteFill>
	);
};

// ============================================================================
// ESCENA 2: TAGLINE PRINCIPAL (1.5-4.5s)
// ============================================================================

const TaglineScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 9, stiffness: 130, mass: 0.6}});
	const opacity = interpolate(entrance, [0, 1], [0, 1]);
	const scale = interpolate(entrance, [0, 1], [0.5, 1]);

	const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{position: 'absolute', top: 110}}>
				<CompactLogoBadge />
			</div>
			<div
				style={{
					opacity: opacity * fadeOut,
					transform: `scale(${scale})`,
					padding: '0 90px',
					textAlign: 'center',
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 100,
					lineHeight: 1.1,
					color: COLORS.white,
					textShadow: `0 8px 24px ${COLORS.shadow}`,
				}}
			>
				{APP_TEXTS.mainTitle}
			</div>
		</AbsoluteFill>
	);
};

// ============================================================================
// ESCENA 3: FÁCIL / RÁPIDA / SEGURA (4.5-7.5s)
// ============================================================================

const FeaturesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{position: 'absolute', top: 110}}>
				<CompactLogoBadge />
			</div>
			<div style={{opacity: fadeOut, display: 'flex', flexDirection: 'column', gap: 36}}>
				{APP_TEXTS.features.map((feature, index) => (
					<FeatureBadge key={feature.label} emoji={feature.emoji} label={feature.label} delay={index * 12} />
				))}
			</div>
		</AbsoluteFill>
	);
};

const FeatureBadge: React.FC<{emoji: string; label: string; delay: number}> = ({
	emoji,
	label,
	delay,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame: frame - delay,
		fps,
		config: {damping: 8, stiffness: 150, mass: 0.6},
	});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(entrance, [0, 1], [0.3, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateX = interpolate(entrance, [0, 1], [-120, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				opacity,
				transform: `translateX(${translateX}px) scale(${scale})`,
				display: 'flex',
				alignItems: 'center',
				gap: 24,
				backgroundColor: 'rgba(10, 10, 10, 0.55)',
				borderRadius: 24,
				padding: '24px 56px',
				boxShadow: `0 10px 30px ${COLORS.shadow}`,
			}}
		>
			<span style={{fontSize: 70}}>{emoji}</span>
			<span
				style={{
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 68,
					color: COLORS.brandYellow,
					letterSpacing: 1,
				}}
			>
				{label}
			</span>
		</div>
	);
};

// ============================================================================
// ESCENA 4: CALL TO ACTION (7.5-10s)
// ============================================================================

const CtaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleEntrance = spring({frame, fps, config: {damping: 9, stiffness: 140, mass: 0.6}});
	const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
	const titleScale = interpolate(titleEntrance, [0, 1], [0.5, 1]);

	const badgeEntrance = spring({
		frame: frame - 15,
		fps,
		config: {damping: 200, stiffness: 110, mass: 0.7},
	});
	const badgeOpacity = interpolate(badgeEntrance, [0, 1], [0, 1]);
	const badgeTranslateY = interpolate(badgeEntrance, [0, 1], [30, 0]);

	const websiteEntrance = spring({
		frame: frame - 28,
		fps,
		config: {damping: 200, stiffness: 110, mass: 0.7},
	});
	const websiteOpacity = interpolate(websiteEntrance, [0, 1], [0, 1]);

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{position: 'absolute', top: 110}}>
				<CompactLogoBadge />
			</div>
			<div
				style={{
					opacity: titleOpacity,
					transform: `scale(${titleScale})`,
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 80,
					color: COLORS.white,
					textAlign: 'center',
					textShadow: `0 8px 24px ${COLORS.shadow}`,
					padding: '0 60px',
					marginBottom: 60,
				}}
			>
				{APP_TEXTS.ctaTitle}
			</div>

			<div style={{opacity: badgeOpacity, transform: `translateY(${badgeTranslateY}px)`}}>
				<GooglePlayBadge label={APP_TEXTS.ctaBadge} />
			</div>

			<div
				style={{
					position: 'absolute',
					bottom: 120,
					opacity: websiteOpacity,
					fontFamily: 'Arial, sans-serif',
					fontWeight: 700,
					fontSize: 48,
					color: COLORS.white,
					letterSpacing: 2,
					textShadow: `0 4px 12px ${COLORS.shadow}`,
				}}
			>
				{APP_TEXTS.website}
			</div>
		</AbsoluteFill>
	);
};

// Badge pequeño y persistente del logo, usado en las escenas 2-4.
const CompactLogoBadge: React.FC = () => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 14,
			backgroundColor: 'rgba(10, 10, 10, 0.55)',
			padding: '14px 32px',
			borderRadius: 999,
			boxShadow: `0 8px 20px ${COLORS.shadow}`,
		}}
	>
		<BoltIcon size={44} />
		<span
			style={{
				fontFamily: 'Arial, sans-serif',
				fontWeight: 900,
				fontSize: 44,
				color: COLORS.brandYellow,
				letterSpacing: 3,
			}}
		>
			ZAS
		</span>
	</div>
);
