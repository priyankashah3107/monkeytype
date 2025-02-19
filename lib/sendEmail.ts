import { ServerClient } from "postmark";

const apiToken = process.env.POSTMARK_SERVER_API_TOKEN;
console.log("APITOKEN", apiToken);
if (!apiToken) {
  throw new Error("Missing POSTMARK_SERVER_API_TOKEN in environment variables");
}

const client = new ServerClient(apiToken);

interface SentOTPEmailProps {
  email: string;
  otp: string;
}

// export const sentOTPEmail = async ({ email, otp }: SentOTPEmailProps) => {
//   console.log(`Sending OTP ${otp} to email ${email}`);
//   await client.sendEmail({
//     From: "11020210079@stu.srmuniversity.ac.in",
//     To: email,
//     Subject: "Your OTP Code",
//     TextBody: `Your OTP code is ${otp}. It expires in 5 minutes.`,
//   });
// };

export const sentOTPEmail = async ({ email, otp }: SentOTPEmailProps) => {
  console.log(`Sending OTP ${otp} to email ${email}`);

  try {
    const response = await client.sendEmail({
      From: "11020210079@stu.srmuniversity.ac.in", 
      To: email,
      Subject: "Your OTP Code",
      TextBody: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    });

    console.log("Email sent successfully:", response);
  } catch (error: any) {
    console.error("Error sending email:", error);
  }
};
