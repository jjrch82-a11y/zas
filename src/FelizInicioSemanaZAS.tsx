import React from 'react';
import {
	AbsoluteFill,
	Img,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {ZasLogoLockup, BoltIcon} from './Logo';

// ============================================================================
// CONFIGURACIÓN EDITABLE — cambia esto cada semana, no toques el resto.
// ============================================================================

export const FPS = 30;
export const DURATION_IN_FRAMES = 450; // 15s a 30fps
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

// Logo: coloca tu archivo en public/assets/zas-logo.png y cambia LOGO_MODE a
// 'image'. Ese archivo todavía no existe en el proyecto, así que por defecto
// se usa una recreación vectorial (src/Logo.tsx) para que la plantilla
// funcione sin depender de él. En cuanto agregues el PNG real, cambia
// LOGO_MODE abajo y listo.
export const LOGO_SRC = 'assets/zas-logo.png';
export const LOGO_MODE: 'image' | 'vector' = 'vector';

// Colores de marca ZAS (amarillo/negro estilo mototaxi).
export const COLORS = {
	brandYellow: '#FFC400',
	brandYellowDark: '#E6A800',
	brandBlack: '#0A0A0A',
	brandBlackSoft: '#1A1A1A',
	brandNavy: '#12172A',
	white: '#FFFFFF',
	shadow: 'rgba(0, 0, 0, 0.35)',
};

// Textos de la plantilla. Edita libremente semana a semana.
export const TEXTS = {
	mainTitle: '¡Feliz Inicio de Semana! 🏍️',
	secondaryText: 'Empieza tu semana sabiendo quién viene y cuándo llega',
	trustText: 'Conductores verificados. Tu familia tranquila.',
	ctaTitle: 'Descarga ZAS Mototaxi',
	website: 'zasapps.com',
};

// Timing de cada escena, en frames (30fps). 60+120+120+90+60 = 450 (15s).
export const SCENES = {
	intro: {from: 0, durationInFrames: 60}, // 0-2s: fondo + logo
	mainTitle: {from: 60, durationInFrames: 120}, // 2-6s: texto grande
	secondary: {from: 180, durationInFrames: 120}, // 6-10s: quién viene y cuándo llega
	trust: {from: 300, durationInFrames: 90}, // 10-13s: conductores verificados
	cta: {from: 390, durationInFrames: 60}, // 13-15s: call to action
};

// ============================================================================
// COMPOSICIÓN PRINCIPAL
// ============================================================================

export const FelizInicioSemanaZAS: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.brandBlack}}>
			<Background />
			<PersistentLogo />

			<Sequence from={SCENES.intro.from} durationInFrames={SCENES.intro.durationInFrames}>
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

			<Sequence from={SCENES.trust.from} durationInFrames={SCENES.trust.durationInFrames}>
				<TrustScene />
			</Sequence>

			<Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.durationInFrames}>
				<CtaScene />
			</Sequence>
		</AbsoluteFill>
	);
};

// ============================================================================
// FONDO — gradiente de marca ZAS (amarillo → negro), presente todo el video.
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
// LOGO — respeta LOGO_MODE ('image' usa public/assets/zas-logo.png,
// 'vector' usa la recreación de src/Logo.tsx).
// ============================================================================

const ZasLogo: React.FC<{variant?: 'full' | 'compact'; size?: number}> = ({
	variant = 'full',
	size = 200,
}) => {
	if ((LOGO_MODE as string) === 'image') {
		const width = variant === 'full' ? size : size * 0.85;
		return (
			<Img
				src={staticFile(LOGO_SRC)}
				style={{
					width,
					height: 'auto',
					objectFit: 'contain',
					filter: `drop-shadow(0 8px 20px ${COLORS.shadow})`,
				}}
			/>
		);
	}

	if (variant === 'compact') {
		return (
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
	}

	return <ZasLogoLockup iconSize={size} wordmarkSize={size * 0.62} taglineSize={size * 0.16} />;
};

// ============================================================================
// ESCENA 1: LOGO DE INTRO (0-2s) — fade-in + scale desde el centro.
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
			<div style={{transform: `scale(${scale})`}}>
				<ZasLogo variant="full" size={190} />
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
			<div style={{marginTop: 90, opacity, transform: `translateY(${translateY}px)`}}>
				<ZasLogo variant="compact" />
			</div>
		</AbsoluteFill>
	);
};

// ============================================================================
// ESCENA 2: TÍTULO PRINCIPAL (2-6s) — spring/bounce.
// ============================================================================

const MainTitleScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

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
// ESCENA 3: "QUIÉN VIENE Y CUÁNDO LLEGA" (6-10s) — fade + slide desde abajo.
// ============================================================================

const SecondaryScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const sceneDuration = SCENES.secondary.durationInFrames;

	const entrance = spring({
		frame,
		fps,
		config: {damping: 200, stiffness: 110, mass: 0.7},
	});
	const opacity = interpolate(entrance, [0, 1], [0, 1]);
	const translateY = interpolate(entrance, [0, 1], [90, 0]);

	const fadeOut = interpolate(frame, [sceneDuration - 20, sceneDuration], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					opacity: opacity * fadeOut,
					transform: `translateY(${translateY}px)`,
					padding: '0 100px',
					textAlign: 'center',
					fontFamily: 'Arial, sans-serif',
					fontWeight: 700,
					fontSize: 68,
					lineHeight: 1.3,
					color: COLORS.white,
					textShadow: `0 6px 18px ${COLORS.shadow}`,
				}}
			>
				{TEXTS.secondaryText}
			</div>
		</AbsoluteFill>
	);
};

// ============================================================================
// ESCENA 4: CONDUCTORES VERIFICADOS (10-13s) — texto + ícono de escudo/check.
// ============================================================================

const TrustScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const sceneDuration = SCENES.trust.durationInFrames;

	const iconEntrance = spring({
		frame,
		fps,
		config: {damping: 9, stiffness: 140, mass: 0.6},
	});
	const iconOpacity = interpolate(iconEntrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const iconScale = interpolate(iconEntrance, [0, 1], [0.3, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const textEntrance = spring({
		frame: frame - 10,
		fps,
		config: {damping: 200, stiffness: 110, mass: 0.7},
	});
	const textOpacity = interpolate(textEntrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const textTranslateY = interpolate(textEntrance, [0, 1], [40, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const fadeOut = interpolate(frame, [sceneDuration - 20, sceneDuration], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 90px'}}>
			<div style={{opacity: iconOpacity * fadeOut, transform: `scale(${iconScale})`, marginBottom: 44}}>
				<ShieldCheckIcon size={150} />
			</div>
			<div
				style={{
					opacity: textOpacity * fadeOut,
					transform: `translateY(${textTranslateY}px)`,
					textAlign: 'center',
					fontFamily: 'Arial, sans-serif',
					fontWeight: 700,
					fontSize: 62,
					lineHeight: 1.3,
					color: COLORS.white,
					textShadow: `0 6px 18px ${COLORS.shadow}`,
				}}
			>
				{TEXTS.trustText}
			</div>
		</AbsoluteFill>
	);
};

const ShieldCheckIcon: React.FC<{size?: number}> = ({size = 150}) => (
	<div
		style={{
			position: 'relative',
			width: size,
			height: size,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<span style={{fontSize: size, filter: `drop-shadow(0 10px 20px ${COLORS.shadow})`}}>🛡️</span>
		<div
			style={{
				position: 'absolute',
				bottom: size * 0.04,
				right: size * 0.02,
				width: size * 0.4,
				height: size * 0.4,
				borderRadius: '50%',
				backgroundColor: '#2ECC71',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				border: `${size * 0.03}px solid ${COLORS.brandBlack}`,
			}}
		>
			<span style={{fontSize: size * 0.22, color: COLORS.white, fontWeight: 900}}>✓</span>
		</div>
	</div>
);

// ============================================================================
// ESCENA 5: CALL TO ACTION (13-15s)
// ============================================================================

const CtaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleEntrance = spring({frame, fps, config: {damping: 10, stiffness: 120, mass: 0.6}});
	const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
	const titleScale = interpolate(titleEntrance, [0, 1], [0.5, 1]);

	const websiteEntrance = spring({
		frame: frame - 15,
		fps,
		config: {damping: 200, stiffness: 110, mass: 0.7},
	});
	const websiteOpacity = interpolate(websiteEntrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					opacity: titleOpacity,
					transform: `scale(${titleScale})`,
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 84,
					color: COLORS.white,
					textAlign: 'center',
					textShadow: `0 8px 24px ${COLORS.shadow}`,
					padding: '0 60px',
				}}
			>
				{TEXTS.ctaTitle}
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

// Badge genérico estilo "disponible en Google Play", reutilizado por otras
// composiciones (ver src/UsaZasApp.tsx). No reproduce el logo oficial de
// Google; sustitúyelo por el asset oficial si lo necesitas.
export const GooglePlayBadge: React.FC<{label?: string}> = ({
	label = 'Disponible en Google Play',
}) => {
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
				{label}
			</span>
		</div>
	);
};
