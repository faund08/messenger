

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
// import clientPromise from '@/lib/mongodb'


export async function POST( request: NextRequest ) {
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

        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error registering user" }, { status: 500 });
    }
};