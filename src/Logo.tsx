import React from 'react';
import {COLORS} from './FelizInicioSemanaZAS';

// Recreación vectorial del logo ZAS (rayo con degradado amarillo → verde → azul,
// wordmark "ZAS" y tagline). Si tienes el archivo de logo original, colócalo en
// public/zas-logo.png y sustituye este componente por
// <Img src={staticFile('zas-logo.png')} /> para usar el asset pixel-perfecto.

export const BoltIcon: React.FC<{size?: number}> = ({size = 160}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		style={{filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.45))'}}
	>
		<defs>
			<linearGradient id="zasBoltGradient" x1="0%" y1="0%" x2="0%" y2="100%">
				<stop offset="0%" stopColor="#F7E24B" />
				<stop offset="45%" stopColor="#3FDC8C" />
				<stop offset="75%" stopColor="#2FC6D8" />
				<stop offset="100%" stopColor="#3B8CE8" />
			</linearGradient>
		</defs>
		<path
			d="M11.3 1.05a1 1 0 0 1 .7 1.02L11.2 9H16a1 1 0 0 1 .8 1.6l-8 10.4a1 1 0 0 1-1.78-.78L8.2 13H4a1 1 0 0 1-.8-1.6l7-10a1 1 0 0 1 1.1-.35Z"
			fill="url(#zasBoltGradient)"
		/>
	</svg>
);

export const ZasWordmark: React.FC<{fontSize?: number}> = ({fontSize = 140}) => (
	<div
		style={{
			fontFamily: 'Arial, sans-serif',
			fontWeight: 900,
			fontSize,
			color: COLORS.brandYellow,
			letterSpacing: fontSize * 0.03,
			lineHeight: 1,
			textShadow: '0 6px 18px rgba(0,0,0,0.5)',
		}}
	>
		ZAS
	</div>
);

export const ZasLogoLockup: React.FC<{
	iconSize?: number;
	wordmarkSize?: number;
	taglineSize?: number;
	showTagline?: boolean;
}> = ({iconSize = 170, wordmarkSize = 130, taglineSize = 34, showTagline = true}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<BoltIcon size={iconSize} />
		<div style={{marginTop: iconSize * 0.06}}>
			<ZasWordmark fontSize={wordmarkSize} />
		</div>
		{showTagline ? (
			<div
				style={{
					marginTop: taglineSize * 0.4,
					fontFamily: 'Arial, sans-serif',
					fontWeight: 400,
					fontSize: taglineSize,
					color: '#C7CBDA',
					letterSpacing: 1,
				}}
			>
				Tu mototaxi al instante
			</div>
		) : null}
	</div>
);
