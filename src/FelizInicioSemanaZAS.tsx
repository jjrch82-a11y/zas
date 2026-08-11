import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	Loop,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {DynamicBackground} from './DynamicBackground';
import {ZasLogoLockup, BoltIcon, MototaxiRiderIcon} from './Logo';
import {COLORS} from './theme';

export {COLORS};

// ============================================================================
// CONFIGURACIÓN EDITABLE — cambia esto cada semana, no toques el resto.
// ============================================================================

export const FPS = 30;
export const DURATION_IN_FRAMES = 600; // 20s a 30fps
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

// Logo: coloca tu archivo en public/assets/zas-logo.png y cambia LOGO_MODE a
// 'image'. Ese archivo todavía no existe en el proyecto, así que por defecto
// se usa una recreación vectorial (src/Logo.tsx) para que la plantilla
// funcione sin depender de él. En cuanto agregues el PNG real, cambia
// LOGO_MODE abajo y listo.
export const LOGO_SRC = 'assets/zas-logo.png';
export const LOGO_MODE: 'image' | 'vector' = 'vector';

// Audio: música de fondo (loopeada) + sonido de transición en cada corte de
// escena. Ambos generados localmente (ver public/bg-music.mp3 y whoosh.mp3).
export const AUDIO = {
	music: 'bg-music.mp3',
	musicLoopDurationInFrames: 300, // el clip dura 10s (300f a 30fps)
	whoosh: 'whoosh.mp3',
};

// Textos de la plantilla. Edita libremente semana a semana.
export const TEXTS = {
	mainTitle: '¿Vas a salir? No pares en la esquina a esperar.',
	secondaryText: 'Pide tu ZAS y llega seguro, a tu hora.',
	trustText: 'Conductores verificados. Tu familia tranquila.',
	ctaTitle: 'Descarga ZAS en la Play Store',
	ctaBadge: 'Disponible en Google Play',
	website: 'zasapps.com',
	socialTitle: 'Síguenos en nuestras redes',
	social: [
		{platform: 'Instagram', handle: '@zasapp_2026', color: '#E1306C'},
		{platform: 'TikTok', handle: '@zasapp2026', color: '#25F4EE'},
		{platform: 'Facebook', handle: '@zasapp', color: '#1877F2'},
	],
};

// Timing de cada escena, en frames (30fps). 60+120+120+90+90+120 = 600 (20s).
export const SCENES = {
	intro: {from: 0, durationInFrames: 60}, // 0-2s: fondo + logo
	mainTitle: {from: 60, durationInFrames: 120}, // 2-6s: texto grande
	secondary: {from: 180, durationInFrames: 120}, // 6-10s: quién viene y cuándo llega
	trust: {from: 300, durationInFrames: 90}, // 10-13s: conductores verificados
	cta: {from: 390, durationInFrames: 90}, // 13-16s: call to action + Play Store
	social: {from: 480, durationInFrames: 120}, // 16-20s: redes sociales
};

const CUT_FRAMES = [
	SCENES.intro.from,
	SCENES.mainTitle.from,
	SCENES.secondary.from,
	SCENES.trust.from,
	SCENES.cta.from,
	SCENES.social.from,
];

// ============================================================================
// COMPOSICIÓN PRINCIPAL
// ============================================================================

export const FelizInicioSemanaZAS: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.brandBlack}}>
			<DynamicBackground cutFrames={CUT_FRAMES} />
			<PersistentLogo />

			<Loop durationInFrames={AUDIO.musicLoopDurationInFrames}>
				<Audio src={staticFile(AUDIO.music)} volume={0.5} />
			</Loop>
			{CUT_FRAMES.map((cutFrame) => (
				<Sequence key={cutFrame} from={cutFrame} durationInFrames={20}>
					<Audio src={staticFile(AUDIO.whoosh)} volume={0.65} />
				</Sequence>
			))}

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

			<Sequence from={SCENES.social.from} durationInFrames={SCENES.social.durationInFrames}>
				<SocialScene />
			</Sequence>
		</AbsoluteFill>
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
					fontSize: 80,
					lineHeight: 1.2,
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
// ESCENA 5: CALL TO ACTION (13-16s) — mototaxista + Play Store.
// ============================================================================

const CtaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const riderEntrance = spring({frame, fps, config: {damping: 9, stiffness: 140, mass: 0.6}});
	const riderOpacity = interpolate(riderEntrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const riderScale = interpolate(riderEntrance, [0, 1], [0.4, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const titleEntrance = spring({
		frame: frame - 10,
		fps,
		config: {damping: 10, stiffness: 120, mass: 0.6},
	});
	const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const titleScale = interpolate(titleEntrance, [0, 1], [0.5, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const badgeEntrance = spring({
		frame: frame - 26,
		fps,
		config: {damping: 200, stiffness: 110, mass: 0.7},
	});
	const badgeOpacity = interpolate(badgeEntrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const badgeTranslateY = interpolate(badgeEntrance, [0, 1], [30, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const websiteEntrance = spring({
		frame: frame - 38,
		fps,
		config: {damping: 200, stiffness: 110, mass: 0.7},
	});
	const websiteOpacity = interpolate(websiteEntrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{opacity: riderOpacity, transform: `scale(${riderScale})`, marginBottom: 18}}>
				<MototaxiRiderIcon size={210} />
			</div>

			<div
				style={{
					opacity: titleOpacity,
					transform: `scale(${titleScale})`,
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 72,
					color: COLORS.white,
					textAlign: 'center',
					textShadow: `0 8px 24px ${COLORS.shadow}`,
					padding: '0 70px',
					marginBottom: 30,
				}}
			>
				{TEXTS.ctaTitle}
			</div>

			<div style={{opacity: badgeOpacity, transform: `translateY(${badgeTranslateY}px)`}}>
				<GooglePlayBadge label={TEXTS.ctaBadge} />
			</div>

			<div
				style={{
					position: 'absolute',
					bottom: 90,
					opacity: websiteOpacity,
					fontFamily: 'Arial, sans-serif',
					fontWeight: 700,
					fontSize: 44,
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

// ============================================================================
// ESCENA 6: REDES SOCIALES (16-20s)
// ============================================================================

const SocialScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const sceneDuration = SCENES.social.durationInFrames;

	const titleEntrance = spring({frame, fps, config: {damping: 200, stiffness: 120, mass: 0.7}});
	const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const titleTranslateY = interpolate(titleEntrance, [0, 1], [30, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const fadeOut = interpolate(frame, [sceneDuration - 20, sceneDuration], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					opacity: titleOpacity * fadeOut,
					transform: `translateY(${titleTranslateY}px)`,
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 62,
					color: COLORS.white,
					textAlign: 'center',
					textShadow: `0 6px 18px ${COLORS.shadow}`,
					marginBottom: 44,
				}}
			>
				{TEXTS.socialTitle}
			</div>
			<div style={{opacity: fadeOut, display: 'flex', flexDirection: 'column', gap: 26}}>
				{TEXTS.social.map((item, index) => (
					<SocialRow
						key={item.platform}
						platform={item.platform}
						handle={item.handle}
						color={item.color}
						delay={16 + index * 10}
					/>
				))}
			</div>
		</AbsoluteFill>
	);
};

const SocialRow: React.FC<{platform: string; handle: string; color: string; delay: number}> = ({
	platform,
	handle,
	color,
	delay,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame: frame - delay,
		fps,
		config: {damping: 9, stiffness: 150, mass: 0.6},
	});
	const opacity = interpolate(entrance, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(entrance, [0, 1], [0.4, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateX = interpolate(entrance, [0, 1], [-110, 0], {
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
				gap: 22,
				backgroundColor: 'rgba(10, 10, 10, 0.55)',
				borderRadius: 20,
				padding: '20px 48px',
				boxShadow: `0 10px 30px ${COLORS.shadow}`,
			}}
		>
			<div style={{width: 20, height: 20, borderRadius: '50%', backgroundColor: color}} />
			<div style={{display: 'flex', flexDirection: 'column'}}>
				<span
					style={{
						fontFamily: 'Arial, sans-serif',
						fontWeight: 900,
						fontSize: 40,
						color: COLORS.white,
					}}
				>
					{platform}
				</span>
				<span
					style={{
						fontFamily: 'Arial, sans-serif',
						fontWeight: 700,
						fontSize: 32,
						color: COLORS.brandYellow,
					}}
				>
					{handle}
				</span>
			</div>
		</div>
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
