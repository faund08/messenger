import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_ke';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const tokenFromHeader = authHeader?.split(' ')[1];

  const cookie = req.headers.get('cookie') || '';
  const tokenFromCookie = cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1];

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized: No token' }), { status: 401 });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload — данные из токена, например { userId, username, iat, exp }

    // Возвращаем профиль пользователя (пример)
    return new NextResponse(
      JSON.stringify({ username: (payload as any).username, email: (payload as any).email }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
  console.error('JWT verify error:', e);
  return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
}

}
