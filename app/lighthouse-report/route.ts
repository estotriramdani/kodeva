import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  const filePath = path.join(process.cwd(), 'lighthouse-detail-report.html');
  
  if (!fs.existsSync(filePath)) {
    return new NextResponse('Lighthouse report file not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const html = fs.readFileSync(filePath, 'utf-8');

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
