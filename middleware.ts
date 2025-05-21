import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BLOCKED_COUNTRIES = ['CN', 'RU', 'KP', 'IR', 'SY', 'BY', 'CU', 'KR']; // 중국, 러시아, 북한, 이란, 시리아, 벨라루스, 쿠바, 한국

export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'UNKNOWN';

  if (BLOCKED_COUNTRIES.includes(country)) {
    return new NextResponse(
      JSON.stringify({
        message: 'This service is not available in your country.',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
