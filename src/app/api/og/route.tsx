import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const amiriRegularUrl = 'https://fonts.gstatic.com/s/amiri/v26/J7a1npd8CGxZHp2cTDU.ttf';
const amiriBoldUrl = 'https://fonts.gstatic.com/s/amiri/v26/J7aznpd8CGxZHp2cl_i6-Q.ttf';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'مِعمار للتحليلات الاستراتيجية';
    const category = searchParams.get('category') || 'تحليلات';
    const author = searchParams.get('author') || 'فريق مِعمار';

    const amiriBold = await fetch(amiriBoldUrl).then((res) => res.arrayBuffer());
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#FCFBF9', // Branded paper background
            color: '#111111',
            padding: '80px',
            border: '12px solid #111111', // Strong contrasting border
            position: 'relative',
            direction: 'rtl',
            fontFamily: 'Amiri',
          }}
        >
          {/* Subtle noise/texture overlay approximation */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.03,
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'auto' }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Me'mar / مِعمار
            </div>
            <div
              style={{
                fontSize: 24,
                backgroundColor: '#111111',
                color: '#FCFBF9',
                padding: '8px 24px',
                borderRadius: '4px',
                display: 'flex',
              }}
            >
              {category}
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              lineHeight: 1.2,
              marginTop: '40px',
              marginBottom: '60px',
              maxWidth: '900px',
              display: 'flex',
            }}
          >
            {title}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 24, color: '#666666', marginBottom: '8px', display: 'flex' }}>الكاتب</span>
              <span style={{ fontSize: 32, fontWeight: 'bold', display: 'flex' }}>{author}</span>
            </div>
            <div style={{ display: 'flex', width: '80px', height: '4px', backgroundColor: '#D4AF37' /* Amber-like accent */ }} />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Amiri',
            data: amiriBold,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
