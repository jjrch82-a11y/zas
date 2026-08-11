import React from 'react';
import {COLORS} from './theme';

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

// Mototaxista estilizado: casco y chaqueta negros con el rayo de ZAS,
// sosteniendo un teléfono que muestra el logo en la pantalla. Ilustración
// plana (divs), consistente con el resto de los íconos vectoriales.
export const MototaxiRiderIcon: React.FC<{size?: number}> = ({size = 300}) => {
	const scale = size / 300;

	return (
		<div style={{position: 'relative', width: 220 * scale, height: 300 * scale}}>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: 220,
					height: 300,
					transform: `scale(${scale})`,
					transformOrigin: 'top left',
				}}
			>
				{/* Casco */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 40,
						width: 140,
						height: 120,
						background: COLORS.brandBlack,
						borderRadius: '70px 70px 55px 55px',
						boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
					}}
				>
					{/* Visor */}
					<div
						style={{
							position: 'absolute',
							top: 52,
							left: 10,
							width: 120,
							height: 38,
							background: 'linear-gradient(135deg, #3A4666 0%, #12172A 100%)',
							borderRadius: 20,
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								position: 'absolute',
								top: 4,
								left: 10,
								width: 44,
								height: 10,
								background: 'rgba(255,255,255,0.2)',
								borderRadius: 6,
								transform: 'rotate(-10deg)',
							}}
						/>
					</div>
					{/* Rayo ZAS en el casco */}
					<div style={{position: 'absolute', top: 12, left: 56}}>
						<BoltIcon size={28} />
					</div>
				</div>

				{/* Chaqueta / hombros */}
				<div
					style={{
						position: 'absolute',
						top: 105,
						left: 10,
						width: 200,
						height: 160,
						background: COLORS.brandBlack,
						clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					}}
				>
					{/* Cuello */}
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: '50%',
							transform: 'translateX(-50%)',
							width: 70,
							height: 18,
							background: COLORS.brandBlackSoft,
							borderRadius: '0 0 12px 12px',
						}}
					/>
					{/* Parche con el rayo en el pecho */}
					<div style={{position: 'absolute', top: 44, left: '50%', transform: 'translateX(-50%)'}}>
						<BoltIcon size={22} />
					</div>
				</div>

				{/* Brazos */}
				<div
					style={{
						position: 'absolute',
						top: 148,
						left: -8,
						width: 74,
						height: 26,
						background: COLORS.brandBlack,
						borderRadius: 14,
						transform: 'rotate(18deg)',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						top: 148,
						right: -8,
						width: 74,
						height: 26,
						background: COLORS.brandBlack,
						borderRadius: 14,
						transform: 'rotate(-18deg)',
					}}
				/>

				{/* Teléfono con el logo de ZAS en pantalla */}
				<div
					style={{
						position: 'absolute',
						top: 178,
						left: '50%',
						transform: 'translateX(-50%)',
						width: 76,
						height: 112,
						background: '#E8EAF0',
						borderRadius: 14,
						border: `3px solid ${COLORS.brandBlack}`,
						boxShadow: '0 10px 28px rgba(63,220,140,0.4), 0 6px 16px rgba(0,0,0,0.45)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div
						style={{
							width: 60,
							height: 98,
							background: COLORS.brandNavy,
							borderRadius: 8,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<BoltIcon size={32} />
					</div>
				</div>
			</div>
		</div>
	);
};

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
