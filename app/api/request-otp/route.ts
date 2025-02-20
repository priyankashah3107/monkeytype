import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sentOTPEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      
      if (user.otpExpires && new Date() < user.otpExpires) {
        return NextResponse.json(
          {
            error:
              "OTP is still valid. Please wait before requesting a new one.",
          },
          { status: 400 }
        );
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await prisma.user.upsert({
      where: { email },
      update: { otp: hashedOTP, otpExpires: expiryTime },
      create: { email, otp: hashedOTP, otpExpires: expiryTime },
    });

   
    await sentOTPEmail({ email, otp });

    return NextResponse.json({ message: "New OTP sent to your email" });
  } catch (error) {
    return NextResponse.json({ error: "Error sending OTP" }, { status: 500 });
  }
}
