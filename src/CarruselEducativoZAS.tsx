import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BoltIcon} from './Logo';
import {COLORS} from './theme';
import {GooglePlayBadge} from './FelizInicioSemanaZAS';

// ============================================================================
// CONFIGURACIÓN EDITABLE — agrega, quita o reordena elementos de SLIDES para
// armar un nuevo carrusel. Cada slide se convierte automáticamente en una
// composición Still independiente (CarruselEducativoZAS-1, -2, -3...) desde
// Root.tsx, así que no hay que tocar nada más al cambiar el número de slides.
// El número "1/5", "2/5"... se calcula solo a partir de la posición en el
// array, para que nunca quede desincronizado.
//
// `screenshot` es el nombre del archivo dentro de public/screenshots/.
//
// TEXTOS PENDIENTES: titulo/descripcion son placeholders — reemplázalos con
// el copy real de cada paso una vez que confirmes el contenido de las
// capturas.
// ============================================================================

export const CAROUSEL_WIDTH = 1080;
export const CAROUSEL_HEIGHT = 1350; // 4:5, formato carrusel de Instagram

type Slide = {
	titulo: string;
	descripcion: string;
	screenshot: string;
};

export const SLIDES: Slide[] = [
	{
		titulo: '[Título del paso 1]',
		descripcion: '[Descripción breve del paso 1]',
		screenshot: 'paso-1.png',
	},
	{
		titulo: '[Título del paso 2]',
		descripcion: '[Descripción breve del paso 2]',
		screenshot: 'paso-2.png',
	},
	{
		titulo: '[Título del paso 3]',
		descripcion: '[Descripción breve del paso 3]',
		screenshot: 'paso-3.png',
	},
	{
		titulo: '[Título del paso 4]',
		descripcion: '[Descripción breve del paso 4]',
		screenshot: 'paso-4.png',
	},
	{
		titulo: '[Título del paso 5]',
		descripcion: '[Descripción breve del paso 5]',
		screenshot: 'paso-5.png',
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
		<AbsoluteFill style={{backgroundColor: COLORS.brandBlack}}>
			<TopBar numero={numero} />

			<div
				style={{
					position: 'absolute',
					top: TOP_BAR_HEIGHT,
					left: 0,
					right: 0,
					bottom: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '44px 70px 60px',
				}}
			>
				<div
					style={{
						fontFamily: 'Arial, sans-serif',
						fontWeight: 900,
						fontSize: 58,
						lineHeight: 1.15,
						color: COLORS.white,
						textAlign: 'center',
						textShadow: `0 6px 18px ${COLORS.shadow}`,
					}}
				>
					{slide.titulo}
				</div>
				<div
					style={{
						marginTop: 16,
						fontFamily: 'Arial, sans-serif',
						fontWeight: 600,
						fontSize: 32,
						lineHeight: 1.4,
						color: '#C7CBDA',
						textAlign: 'center',
						maxWidth: 780,
					}}
				>
					{slide.descripcion}
				</div>

				<PhoneMockup screenshot={slide.screenshot} />

				{isLastSlide ? <CtaFooter /> : null}
			</div>
		</AbsoluteFill>
	);
};

// ============================================================================
// BARRA SUPERIOR — degradado de marca ZAS (mismos tonos que el rayo del
// logo), número de slide a la izquierda y logo ZAS a la derecha.
// ============================================================================

const TOP_BAR_HEIGHT = 130;

const TopBar: React.FC<{numero: string}> = ({numero}) => (
	<div
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: TOP_BAR_HEIGHT,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 50px',
			background: 'linear-gradient(90deg, #F7E24B 0%, #3FDC8C 45%, #2FC6D8 75%, #3B8CE8 100%)',
			boxShadow: `0 6px 20px ${COLORS.shadow}`,
		}}
	>
		<span
			style={{
				fontFamily: 'Arial, sans-serif',
				fontWeight: 900,
				fontSize: 34,
				color: COLORS.brandBlack,
			}}
		>
			{numero}
		</span>
		<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
			<BoltIcon size={32} />
			<span
				style={{
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 30,
					color: COLORS.brandBlack,
					letterSpacing: 2,
				}}
			>
				ZAS
			</span>
		</div>
	</div>
);

// ============================================================================
// MOCKUP DE TELÉFONO — envuelve la captura de pantalla del paso con un frame
// oscuro, esquinas redondeadas y sombra. Ocupa el espacio central/inferior
// disponible (se achica solo en la última slide para dejar lugar al CTA).
// ============================================================================

const PhoneMockup: React.FC<{screenshot: string}> = ({screenshot}) => (
	<div
		style={{
			flex: 1,
			minHeight: 0,
			width: '100%',
			marginTop: 36,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<div
			style={{
				position: 'relative',
				height: '100%',
				aspectRatio: '9 / 19.5',
				maxWidth: '100%',
				borderRadius: 44,
				padding: 14,
				backgroundColor: '#111318',
				border: '2px solid rgba(255,255,255,0.08)',
				boxShadow: `0 24px 60px ${COLORS.shadow}`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 26,
					left: '50%',
					transform: 'translateX(-50%)',
					width: 70,
					height: 8,
					borderRadius: 6,
					backgroundColor: 'rgba(255,255,255,0.18)',
					zIndex: 1,
				}}
			/>
			<div
				style={{
					width: '100%',
					height: '100%',
					borderRadius: 30,
					overflow: 'hidden',
					backgroundColor: '#000',
				}}
			>
				<Img
					src={staticFile(`screenshots/${screenshot}`)}
					style={{width: '100%', height: '100%', objectFit: 'cover'}}
				/>
			</div>
		</div>
	</div>
);

// ============================================================================
// CTA — se agrega automáticamente solo en la última slide del set.
// ============================================================================

const CtaFooter: React.FC = () => (
	<div
		style={{
			marginTop: 30,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: 18,
		}}
	>
		<div
			style={{
				fontFamily: 'Arial, sans-serif',
				fontWeight: 900,
				fontSize: 36,
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
				fontSize: 28,
				color: COLORS.white,
				letterSpacing: 2,
				textShadow: `0 4px 12px ${COLORS.shadow}`,
			}}
		>
			zasapps.com
		</div>
	</div>
);
