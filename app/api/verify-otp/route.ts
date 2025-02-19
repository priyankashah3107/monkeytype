import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  if (!email || !otp) {
    return NextResponse.json(
      { error: "All Feilds are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.otp || !user.otpExpires) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > user.otpExpires) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
    }
    await prisma.user.update({
      where: { email },
      data: { otp: null, otpExpires: null },
    });

    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error verifying OTP" }, { status: 500 });
  }
}
