import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BoltIcon} from './Logo';
import {COLORS} from './theme';
import {GooglePlayBadge, LOGO_MODE, LOGO_SRC} from './FelizInicioSemanaZAS';

// ============================================================================
// CONFIGURACIÓN EDITABLE — agrega, quita o reordena elementos de SLIDES para
// armar un nuevo carrusel. Cada slide se convierte automáticamente en una
// composición Still independiente (CarruselEducativoZAS-1, -2, -3...) desde
// Root.tsx, así que no hay que tocar nada más al cambiar el número de slides.
// El número "1/3", "2/3"... se calcula solo a partir de la posición en el
// array, para que nunca quede desincronizado.
// ============================================================================

export const CAROUSEL_WIDTH = 1080;
export const CAROUSEL_HEIGHT = 1350; // 4:5, formato carrusel de Instagram

// Íconos disponibles para las slides. Agrega más entradas aquí si necesitas
// otro ícono; el campo `icono` de cada slide se autocompleta con estas claves.
const ICONS = {
	telefono: '📱',
	conductor: '🏍️',
	ubicacion: '📍',
	escudo: '🛡️',
	reloj: '⏱️',
	familia: '👨‍👩‍👧',
} as const;

type Slide = {
	titulo: string;
	descripcion: string;
	icono?: keyof typeof ICONS;
};

export const SLIDES: Slide[] = [
	{
		titulo: 'Abre la app ZAS',
		descripcion: 'Ingresa tu destino y confirma tu ubicación',
		icono: 'telefono',
	},
	{
		titulo: 'Elige tu conductor',
		descripcion: 'Ve quién viene, cuánto tarda y su verificación',
		icono: 'conductor',
	},
	{
		titulo: 'Listo, ya vas en camino',
		descripcion: 'Sigue tu viaje en tiempo real, tu familia también puede verlo',
		icono: 'ubicacion',
	},
];

// ============================================================================
// COMPOSICIÓN — una instancia (Still) por slide. Recibe `slideIndex` como
// prop para saber cuál elemento de SLIDES le toca renderizar.
// ============================================================================

export const CarruselEducativoZAS: React.FC<{slideIndex: number}> = ({slideIndex}) => {
	const slide = SLIDES[slideIndex];
	if (!slide) {
		throw new Error(
			`CarruselEducativoZAS: no existe el slide ${slideIndex} (SLIDES tiene ${SLIDES.length} elementos)`
		);
	}

	const numero = `${slideIndex + 1}/${SLIDES.length}`;
	const isLastSlide = slideIndex === SLIDES.length - 1;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.brandNavy}}>
			<SlideBackground />

			<div
				style={{
					position: 'absolute',
					top: 70,
					left: 70,
					right: 70,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<SlideLogo />
				<SlideNumberBadge numero={numero} />
			</div>

			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 90px',
					paddingBottom: isLastSlide ? 300 : 0,
				}}
			>
				{slide.icono ? (
					<div
						style={{
							fontSize: 130,
							marginBottom: 40,
							filter: `drop-shadow(0 10px 20px ${COLORS.shadow})`,
						}}
					>
						{ICONS[slide.icono]}
					</div>
				) : null}
				<div
					style={{
						fontFamily: 'Arial, sans-serif',
						fontWeight: 900,
						fontSize: 82,
						lineHeight: 1.15,
						color: COLORS.white,
						textAlign: 'center',
						textShadow: `0 8px 24px ${COLORS.shadow}`,
						marginBottom: 30,
					}}
				>
					{slide.titulo}
				</div>
				<div
					style={{
						fontFamily: 'Arial, sans-serif',
						fontWeight: 600,
						fontSize: 40,
						lineHeight: 1.4,
						color: '#D7DAE6',
						textAlign: 'center',
						maxWidth: 820,
					}}
				>
					{slide.descripcion}
				</div>
			</AbsoluteFill>

			{isLastSlide ? <CtaFooter /> : null}
		</AbsoluteFill>
	);
};

// ============================================================================
// FONDO — mismo degradado de marca (verde/azul/amarillo) y viñeta que usan
// FelizInicioSemanaZAS y UsaZasApp, en versión estática (sin animación de
// frame, ya que este componente es una imagen fija).
// ============================================================================

const SlideBackground: React.FC = () => (
	<AbsoluteFill>
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 46% 26%, #3FDC8C4D 0%, transparent 45%),
					radial-gradient(circle at 58% 72%, #3B8CE84D 0%, transparent 50%),
					radial-gradient(circle at 50% 105%, #F7E24B26 0%, transparent 55%)`,
			}}
		/>
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 0.12}}>
			<div style={{transform: 'scale(3.4) rotate(-3deg)'}}>
				<BoltIcon size={260} />
			</div>
		</AbsoluteFill>
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 50% 45%, transparent 40%, ${COLORS.brandNavy}CC 100%)`,
			}}
		/>
	</AbsoluteFill>
);

// ============================================================================
// LOGO — respeta LOGO_MODE/LOGO_SRC definidos en FelizInicioSemanaZAS.tsx:
// coloca public/assets/zas-logo.png y cambia LOGO_MODE a 'image' ahí para
// que el logo real se use en todas las composiciones, incluida esta.
// ============================================================================

const SlideLogo: React.FC = () => {
	if ((LOGO_MODE as string) === 'image') {
		return (
			<Img
				src={staticFile(LOGO_SRC)}
				style={{
					height: 48,
					width: 'auto',
					objectFit: 'contain',
					filter: `drop-shadow(0 6px 14px ${COLORS.shadow})`,
				}}
			/>
		);
	}

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				backgroundColor: 'rgba(10, 10, 10, 0.55)',
				padding: '10px 22px',
				borderRadius: 999,
				boxShadow: `0 6px 16px ${COLORS.shadow}`,
			}}
		>
			<BoltIcon size={30} />
			<span
				style={{
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 26,
					color: COLORS.brandYellow,
					letterSpacing: 2,
				}}
			>
				ZAS
			</span>
		</div>
	);
};

const SlideNumberBadge: React.FC<{numero: string}> = ({numero}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			minWidth: 64,
			height: 64,
			padding: '0 10px',
			borderRadius: 999,
			backgroundColor: 'rgba(10, 10, 10, 0.55)',
			border: `2px solid ${COLORS.brandYellow}`,
			boxShadow: `0 6px 16px ${COLORS.shadow}`,
		}}
	>
		<span style={{fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 24, color: COLORS.white}}>
			{numero}
		</span>
	</div>
);

// ============================================================================
// CTA — se agrega automáticamente solo en la última slide del set.
// ============================================================================

const CtaFooter: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			bottom: 80,
			left: 0,
			right: 0,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: 24,
		}}
	>
		<div
			style={{
				fontFamily: 'Arial, sans-serif',
				fontWeight: 900,
				fontSize: 40,
				color: COLORS.white,
				textAlign: 'center',
				textShadow: `0 6px 16px ${COLORS.shadow}`,
			}}
		>
			Descarga ZAS Mototaxi
		</div>
		<GooglePlayBadge />
		<div
			style={{
				fontFamily: 'Arial, sans-serif',
				fontWeight: 700,
				fontSize: 32,
				color: COLORS.white,
				letterSpacing: 2,
				textShadow: `0 4px 12px ${COLORS.shadow}`,
			}}
		>
			zasapps.com
		</div>
	</div>
);
