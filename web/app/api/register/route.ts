import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import clientPromise from '@/lib/mongodb'

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Используй env переменные!

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // const client = await clientPromise;
        // const db = client.db('db-name');
        // const users = db.collection('users');

        // const existingUser = await users.findOne({ email });

        // if (existingUser) {
        //     return NextResponse.json({ message: 'User already exist' }, { status: 400 });
        // }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        // await users.insertOne({
        //     username,
        //     email,
        //     password: hashedPassword,
        //     createdAt: new Date(),
        // });

        // Генерируем JWT токен после успешной регистрации
        const token = jwt.sign(
          { username, email },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return NextResponse.json(
          { message: "User created", token }, // Возвращаем токен в ответе
          { status: 201 }
        );
    } catch (error) {
  console.error("Registration error:", error);
  return NextResponse.json({ message: "Error registering user" }, { status: 500 });
}

};
