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
// La portada (COVER) es una slide extra de solo texto que siempre va primero
// (Still -1) y no cuenta para el número "n/total" de los pasos — esos siguen
// mostrando "1/5"..."5/5" como antes.
// ============================================================================

export const CAROUSEL_WIDTH = 1080;
export const CAROUSEL_HEIGHT = 1350; // 4:5, formato carrusel de Instagram

const COVER = {
	titulo: 'Así de fácil es pedir tu ZAS',
	subtitulo: 'Guía rápida en 5 pasos',
};

type Slide = {
	titulo: string;
	descripcion: string;
	screenshot: string;
};

export const SLIDES: Slide[] = [
	{
		titulo: 'Inicia sesión en ZAS',
		descripcion: 'Ingresa tu teléfono y contraseña para entrar a tu cuenta',
		screenshot: 'paso-1.jpg',
	},
	{
		titulo: 'Marca tu origen',
		descripcion: 'Mueve el mapa a tu ubicación o búscala directamente',
		screenshot: 'paso-2.jpg',
	},
	{
		titulo: 'Elige tu destino',
		descripcion: 'Confirma a dónde quieres llegar',
		screenshot: 'paso-3.jpg',
	},
	{
		titulo: 'Revisa el precio y confirma',
		descripcion: 'Ajusta tu oferta al conductor si quieres',
		screenshot: 'paso-4.jpg',
	},
	{
		titulo: 'Elige tu forma de pago',
		descripcion: 'Selecciona el método y solicita tu ZAS',
		screenshot: 'paso-5.jpg',
	},
];

// ============================================================================
// COMPOSICIÓN — una instancia (Still) por slide. Recibe `slideIndex` como
// prop: 0 es la portada, 1..SLIDES.length son los pasos (SLIDES[slideIndex - 1]).
// ============================================================================

// Total de Still que Root.tsx debe registrar: la portada + un paso por
// elemento de SLIDES.
export const TOTAL_SLIDES = SLIDES.length + 1;

export const CarruselEducativoZAS: React.FC<{slideIndex: number}> = ({slideIndex}) => {
	if (slideIndex === 0) {
		return <CoverSlide />;
	}

	const slide = SLIDES[slideIndex - 1];
	if (!slide) {
		throw new Error(
			`CarruselEducativoZAS: no existe el slide ${slideIndex} (hay ${SLIDES.length} pasos + 1 portada)`
		);
	}

	const numero = `${slideIndex}/${SLIDES.length}`;
	const isLastSlide = slideIndex === SLIDES.length;

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
// PORTADA — slide 0, solo texto. Usa el degradado de marca a pantalla
// completa (en vez de la franja delgada de las slides de pasos) para
// destacar como gancho de scroll; no lleva número ni mockup de teléfono.
// ============================================================================

const CoverSlide: React.FC = () => (
	<AbsoluteFill
		style={{
			background: `linear-gradient(165deg, #F7E24B 0%, #3FDC8C 32%, #2FC6D8 55%, #3B8CE8 72%, ${COLORS.brandBlack} 100%)`,
		}}
	>
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 110px'}}>
			<div style={{marginBottom: 34, filter: `drop-shadow(0 12px 24px ${COLORS.shadow})`}}>
				<BoltIcon size={120} />
			</div>
			<div
				style={{
					fontFamily: 'Arial, sans-serif',
					fontWeight: 700,
					fontSize: 28,
					color: COLORS.brandBlack,
					letterSpacing: 5,
					textTransform: 'uppercase',
					marginBottom: 26,
				}}
			>
				Guía rápida
			</div>
			<div
				style={{
					fontFamily: 'Arial, sans-serif',
					fontWeight: 900,
					fontSize: 94,
					lineHeight: 1.1,
					color: COLORS.white,
					textAlign: 'center',
					textShadow: `0 10px 26px ${COLORS.shadow}`,
					marginBottom: 26,
				}}
			>
				{COVER.titulo}
			</div>
			<div
				style={{
					fontFamily: 'Arial, sans-serif',
					fontWeight: 600,
					fontSize: 42,
					color: COLORS.white,
					textAlign: 'center',
				}}
			>
				{COVER.subtitulo}
			</div>
		</AbsoluteFill>

		<div
			style={{
				position: 'absolute',
				bottom: 80,
				left: 0,
				right: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 14,
			}}
		>
			<span
				style={{
					fontFamily: 'Arial, sans-serif',
					fontWeight: 700,
					fontSize: 30,
					color: COLORS.white,
					letterSpacing: 1,
					textShadow: `0 4px 12px ${COLORS.shadow}`,
				}}
			>
				Desliza para ver los pasos
			</span>
			<span style={{fontSize: 32, color: COLORS.white, textShadow: `0 4px 12px ${COLORS.shadow}`}}>→</span>
		</div>
	</AbsoluteFill>
);

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
