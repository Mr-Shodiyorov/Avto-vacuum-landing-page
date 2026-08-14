import { ImageResponse } from 'next/og';

import { site } from '@/lib/site';

export const alt = `${site.nameFull} — Qarshida 24/7 avto vakum, palirovka va keramika`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          background: 'linear-gradient(135deg, #0b4a8f 0%, #08325f 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              width: 72,
              height: 72,
              borderRadius: 20,
              background: '#f5871f',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            AV
          </div>
          <div style={{ display: 'flex', fontSize: 30, letterSpacing: 4, opacity: 0.85 }}>
            AVTO VAKUM
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, marginTop: 44, lineHeight: 1.15 }}>
          Avto vakum Qarshida
        </div>
        <div style={{ display: 'flex', fontSize: 34, marginTop: 20, opacity: 0.9 }}>
          24/7 avtomobil tozalash, palirovka va keramika
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 50,
            fontSize: 26,
            padding: '14px 28px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.14)',
          }}
        >
          {site.phones[0].display} · {site.city}
        </div>
      </div>
    ),
    { ...size },
  );
}
