import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = '/lighthouse-report';
  return NextResponse.redirect(url, 307);
}
