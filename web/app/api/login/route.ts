

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


type User = {
    username: string;
    passwordHash: string;
};



const fakeUser: User = {
    username: 'kuroyami',
    passwordHash: '$2a$12$lTM2lMabV7o7oXE5Jeg8huPpPntBhlz.rAGaAzFevOjlqQt7XPRou',
};


export async function POST(request: NextRequest) {
    const { username, password } = await request.json();

    if ( username !== fakeUser.username) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const isValid = await bcrypt.compare( password, fakeUser.passwordHash );

    if (!isValid) {
        return NextResponse.json({ error: 'Ivalid password' }, { status: 401 });
    } 

   // Генерация JWT токена
  const token = jwt.sign(
    { username }, 
    process.env.JWT_SECRET || 'default_secret', 
    { expiresIn: '1h' }
  );

  return NextResponse.json({
    message: 'Logged in successfully',
    token,
  });
}