import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

// ============================================================================
// CONFIGURACIÓN EDITABLE — cambia esto cada semana, no toques el resto.
// ============================================================================

export const FPS = 30;
export const DURATION_IN_FRAMES = 450; // 15s a 30fps
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

// Colores de marca ZAS (amarillo/negro estilo mototaxi).
export const COLORS = {
	brandYellow: '#FFC400',
	brandYellowDark: '#E6A800',
	brandBlack: '#0A0A0A',
	brandBlackSoft: '#1A1A1A',
	white: '#FFFFFF',
	shadow: 'rgba(0, 0, 0, 0.35)',
};

// Textos de la plantilla. Edita libremente semana a semana.
export const TEXTS = {
	logoTitle: 'ZAS',
	logoSubtitle: 'MOTOTAXI',
	mainTitle: '¡Feliz Inicio de Semana! 🏍️',
	secondaryTitle: 'Empieza tu semana rápido y seguro con ZAS Mototaxi',
	ctaTitle: 'Descarga ZAS ahora',
	ctaBadge: 'Disponible en Google Play',
	website: 'zasapps.com',
	mototaxiEmoji: '🏍️',
};

// Timing de cada escena, en frames (30fps). Ajusta si cambias la duración.
export const SCENES = {
	intro: {from: 0, durationInFrames: 60}, // 0-2s: fondo + logo
	mainTitle: {from: 60, durationInFrames: 120}, // 2-6s: texto grande
	secondary: {from: 180, durationInFrames: 150}, // 6-11s: texto + mototaxi
	cta: {from: 330, durationInFrames: 120}, // 11-15s: call to action
};

// ============================================================================
// COMPOSICIÓN PRINCIPAL
// ============================================================================

export const FelizInicioSemanaZAS: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.brandBlack}}>
			<Background />
			<PersistentLogo />

			<Sequence
				from={SCENES.intro.from}
				durationInFrames={SCENES.intro.durationInFrames}
			>
				<IntroLogo />
			</Sequence>

			<Sequence
				from={SCENES.mainTitle.from}
				durationInFrames={SCENES.mainTitle.durationInFrames}
			>
				<MainTitleScene />
			</Sequence>

			<Sequence
				from={SCENES.secondary.from}
				durationInFrames={SCENES.secondary.durationInFrames}
			>
				<SecondaryScene />
			</Sequence>

			<Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.durationInFrames}>
				<CtaScene />
			</Sequence>
		</AbsoluteFill>
	);
};

// ============================================================================
// FONDO
// ============================================================================

const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	// Fade-in del fondo en los primeros frames.
	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Movimiento lento del gradiente para que el fondo se sienta vivo.
	const angle = interpolate(frame, [0, durationInFrames], [135, 165]);

	return (
		<AbsoluteFill
			style={{
				opacity,
				background: `linear-gradient(${angle}deg, ${COLORS.brandYellow} 0%, ${COLORS.brandYellowDark} 45%, ${COLORS.brandBlack} 100%)`,
			}}
		/>
	);
};

// ============================================================================
// LOGO — grande en la intro, luego se reduce a un badge fijo arriba.
// ============================================================================

const IntroLogo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 200, stiffness: 120, mass: 0.8},
	});

	const opacity = interpolate(entrance, [0, 1], [0, 1]);
	const scale = interpolate(entrance, [0, 1], [0.6, 1]);

	// Se desvanece hacia el final de la escena para dar paso al logo persistente.
	const fadeOut = interpolate(frame, [40, 60], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				opacity: opacity * fadeOut,
			}}
		>
			<div style={{transform: `scale(${scale})`, textAlign: 'center'}}>
				<div
					style={{
						fontFamily: 'Arial, sans-serif',
						fontWeight: 900,
						fontSize: 220,
						color: COLORS.brandBlack,
						letterSpacing: 8,
						textShadow: `0 10px 30px ${COLORS.shadow}`,
					}}
				>
					{TEXTS.logoTitle}
				</div>
				<div
					style={{
						fontFamily: 'Arial, sans-serif',
						fontWeight: 700,
						fontSize: 48,
						color: COLORS.brandBlack,
						letterSpacing: 20,
						marginTop: 10,
					}}
				>
					{TEXTS.logoSubtitle}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const PersistentLogo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Aparece justo cuando el logo grande de la intro se está desvaneciendo.
	const entrance = spring({
		frame: frame - (SCENES.intro.from + 40),
		fps,
		config: {damping: 200, stiffness: 120, mass: 0.8},
	});

	const opacity = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateY = interpolate(entrance, [0, 1], [-20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start'}}>
			<div
				style={{
					marginTop: 90,
					opacity,
					transform: `translateY(${translateY}px)`,
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 56,
					color: COLORS.brandBlack,
					letterSpacing: 4,
					backgroundColor: COLORS.brandYellow,
					padding: '10px 32px',
					borderRadius: 999,
					boxShadow: `0 8px 20px ${COLORS.shadow}`,
				}}
			>
				{TEXTS.logoTitle}
			</div>
		</AbsoluteFill>
	);
};

// ============================================================================
// ESCENA 2: TÍTULO PRINCIPAL (2-6s)
// ============================================================================

const MainTitleScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 10, stiffness: 100, mass: 0.6},
	});

	const opacity = interpolate(entrance, [0, 1], [0, 1]);
	const scale = interpolate(entrance, [0, 1], [0.3, 1]);

	const fadeOut = interpolate(
		frame,
		[SCENES.mainTitle.durationInFrames - 20, SCENES.mainTitle.durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				padding: '0 80px',
			}}
		>
			<div
				style={{
					opacity: opacity * fadeOut,
					transform: `scale(${scale})`,
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 96,
					lineHeight: 1.15,
					color: COLORS.white,
					textAlign: 'center',
					textShadow: `0 8px 24px ${COLORS.shadow}`,
				}}
			>
				{TEXTS.mainTitle}
			</div>
		</AbsoluteFill>
	);
};

// ============================================================================
// ESCENA 3: TEXTO SECUNDARIO + MOTOTAXI ANIMADO (6-11s)
// ============================================================================

const SecondaryScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const sceneDuration = SCENES.secondary.durationInFrames;

	const textEntrance = spring({
		frame,
		fps,
		config: {damping: 200, stiffness: 110, mass: 0.7},
	});
	const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);
	const textTranslateY = interpolate(textEntrance, [0, 1], [40, 0]);

	const fadeOut = interpolate(frame, [sceneDuration - 20, sceneDuration], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// El mototaxi recorre la pantalla de izquierda a derecha durante toda la escena.
	const mototaxiX = interpolate(frame, [10, sceneDuration - 10], [-200, VIDEO_WIDTH + 200], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const mototaxiBounce = Math.sin(frame / 4) * 10;

	return (
		<AbsoluteFill style={{justifyContent: 'center'}}>
			<div
				style={{
					opacity: textOpacity * fadeOut,
					transform: `translateY(${textTranslateY}px)`,
					padding: '0 100px',
					textAlign: 'center',
					fontFamily: 'Arial, sans-serif',
					fontWeight: 700,
					fontSize: 64,
					lineHeight: 1.3,
					color: COLORS.white,
					textShadow: `0 6px 18px ${COLORS.shadow}`,
				}}
			>
				{TEXTS.secondaryTitle}
			</div>

			<div
				style={{
					position: 'absolute',
					top: '68%',
					left: 0,
					opacity: fadeOut,
					transform: `translateX(${mototaxiX}px) translateY(${mototaxiBounce}px) scaleX(-1)`,
					fontSize: 160,
				}}
			>
				{TEXTS.mototaxiEmoji}
			</div>
		</AbsoluteFill>
	);
};

// ============================================================================
// ESCENA 4: CALL TO ACTION (11-15s)
// ============================================================================

const CtaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleEntrance = spring({
		frame,
		fps,
		config: {damping: 10, stiffness: 120, mass: 0.6},
	});
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
		frame: frame - 30,
		fps,
		config: {damping: 200, stiffness: 110, mass: 0.7},
	});
	const websiteOpacity = interpolate(websiteEntrance, [0, 1], [0, 1]);

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					opacity: titleOpacity,
					transform: `scale(${titleScale})`,
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 88,
					color: COLORS.white,
					textAlign: 'center',
					textShadow: `0 8px 24px ${COLORS.shadow}`,
					marginBottom: 60,
				}}
			>
				{TEXTS.ctaTitle}
			</div>

			<div
				style={{
					opacity: badgeOpacity,
					transform: `translateY(${badgeTranslateY}px)`,
				}}
			>
				<GooglePlayBadge />
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
				{TEXTS.website}
			</div>
		</AbsoluteFill>
	);
};

// Badge genérico estilo "disponible en Google Play". No reproduce el logo
// oficial de Google; sustitúyelo por el asset oficial si lo necesitas.
const GooglePlayBadge: React.FC = () => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				backgroundColor: COLORS.brandBlack,
				color: COLORS.white,
				padding: '22px 40px',
				borderRadius: 16,
				boxShadow: `0 10px 30px ${COLORS.shadow}`,
			}}
		>
			<div
				style={{
					width: 0,
					height: 0,
					borderTop: '14px solid transparent',
					borderBottom: '14px solid transparent',
					borderLeft: `22px solid ${COLORS.brandYellow}`,
				}}
			/>
			<span style={{fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 34}}>
				{TEXTS.ctaBadge}
			</span>
		</div>
	);
};
