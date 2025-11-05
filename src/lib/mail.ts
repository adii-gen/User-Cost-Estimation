import { StudentDetails } from "@/types/type";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_EMAIL_USER,
    pass: process.env.NODEMAILER_EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

export async function sendEmailVerificationEmail(email: string, token: string) {
  const emailVerificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_ENDPOINT}`;
  const url = `${emailVerificationUrl}?token=${token}`;

  try {
    console.log(`Sending email for account activation to ${email}`);
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL_USER,
      to: email,
      subject: "Activate your account",
      html: `
        <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Activation</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #d58829;
                padding: 20px;
                text-align: center;
                color: white;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
              }
              .content {
                background-color: #ffffff;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-bottom-left-radius: 5px;
                border-bottom-right-radius: 5px;
              }
              .button {
                display: inline-block;
                background-color: #d58829;
                color: white;
                text-decoration: none;
                padding: 12px 30px;
                border-radius: 4px;
                margin: 20px 0;
                font-weight: bold;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                color: white;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">Tms</div>
              </div>
              <div class="content">
                <h2>Account Activation</h2>
                <p>Hello,</p>
                <p>Thank you for registering with Ticket Management System.</p>
                <p>Click the button below to activate your account:</p>
                <div style="text-align: center;">
                  <a href="${url}" class="button">Activate Account</a>
                </div>
                <p>If you didn't request this email, please ignore it.</p>
                <p>Best regards,<br>The Gennext It Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 TMS. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
      `,
    });
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error(`Error sending email!`, error);
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetPasswordUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_RESET_PASSWORD_ENDPOINT}`;
  const url = `${resetPasswordUrl}?token=${token}`;

  try {
    console.log(`Sending email to reset password to ${email}`);
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
    });
  } catch (error) {
    console.error(`Error sending email!`, error);
  }
}

export async function sendEmailAbsenceEmail(
  date: string,
  fromTime: string,
  toTime: string,
  studentDetails: StudentDetails
) {
  try {
    console.log(
      `Sending email for absence reporting to ${studentDetails.fatherEmail}`
    );

    // networkDiagnostics().catch(console.error);
    // advancedNetworkDiagnostics()
    //   .then((result) => console.log("Successful Connection:", result))
    //   .catch((error) => console.error("Final Diagnostic Failure:", error));
    // getNetworkInfo();
    const emailContent = `
      <div>
        <p>Dear Mr. <strong>${studentDetails.fatherName}</strong>,</p>
        <p>This is to inform you that your ward <strong>${studentDetails.studentName}</strong> was absent in the following class:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Detail</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Information</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dddddd; padding: 8px;"><strong>Phase</strong></td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${studentDetails.phase}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dddddd; padding: 8px;"><strong>Subject</strong></td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${studentDetails.subject}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dddddd; padding: 8px;"><strong>Batch</strong></td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${studentDetails.batch}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dddddd; padding: 8px;"><strong>Date</strong></td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${date}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dddddd; padding: 8px;"><strong>Time</strong></td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${fromTime} - ${toTime}</td>
          </tr>
        </table>
        <p>Regards,</p>
        <p>[PIMS Absence Management System]</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL_USER,
      to: studentDetails.fatherEmail,
      subject: "Student Absence Notification",
      html: emailContent,
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error(`Error sending email!`, error);
  }
}

const dns = require("dns");
const net = require("net");

// DNS Resolution Test
function testDNSResolution() {
  return new Promise((resolve, reject) => {
    dns.resolve("smtp.gmail.com", (err: any, addresses: unknown) => {
      if (err) {
        console.error("DNS Resolution Error:", err);
        reject(err);
      } else {
        console.log("Resolved SMTP Addresses:", addresses);
        resolve(addresses);
      }
    });
  });
}

// Direct Socket Connection Test
function testSocketConnection() {
  return new Promise<void>((resolve, reject) => {
    const socket = new net.Socket();

    socket.setTimeout(5000);

    socket.connect(587, "smtp.gmail.com", () => {
      console.log("Socket Connection Successful");
      socket.destroy();
      resolve();
    });

    socket.on("error", (err: any) => {
      console.error("Socket Connection Error:", err);
      reject(err);
    });

    socket.on("timeout", () => {
      console.error("Socket Connection Timeout");
      socket.destroy();
      reject(new Error("Connection Timeout"));
    });
  });
}

// Alternative Nodemailer Configuration
function createAlternativeTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    requireTLS: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL_USER,
      pass: process.env.NODEMAILER_EMAIL_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    debug: true, // Enable debugging
  });
}

// Comprehensive Network Test
async function networkDiagnostics() {
  try {
    console.log("Running DNS Resolution Test...");
    await testDNSResolution();

    console.log("Running Socket Connection Test...");
    await testSocketConnection();

    console.log("Creating Alternative Transporter...");
    const transporter = createAlternativeTransporter();

    console.log("Verifying Transporter...");
    await transporter.verify();

    console.log("All Network Tests Passed!");
  } catch (error) {
    console.error("Network Diagnostics Failed:", error);
    throw error;
  }
}

// Advanced Network Diagnostics
async function advancedNetworkDiagnostics() {
  console.log("Starting Advanced Network Diagnostics...");

  // Explicit DNS Configuration
  dns.setServers([
    "8.8.8.8", // Google's public DNS
    "1.1.1.1", // Cloudflare's DNS
  ]);

  // Multiple Connection Strategies
  const connectionStrategies = [
    {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
    },
    {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
    },
    {
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL_USER,
        pass: process.env.NODEMAILER_EMAIL_PASSWORD,
      },
    },
  ];

  for (const strategy of connectionStrategies) {
    try {
      console.log("Attempting connection with strategy:", strategy);

      const transporter = nodemailer.createTransport({
        ...strategy,
        auth: {
          user: process.env.NODEMAILER_EMAIL_USER,
          pass: process.env.NODEMAILER_EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        debug: true,
      });

      // Verify connection
      await new Promise((resolve, reject) => {
        transporter.verify((error, success) => {
          if (error) {
            console.error("Verification failed:", error);
            reject(error);
          } else {
            console.log("Verification successful");
            resolve(success);
          }
        });
      });

      // Test email sending
      const testResult = await new Promise((resolve, reject) => {
        transporter.sendMail(
          {
            from: process.env.NODEMAILER_EMAIL_USER,
            to: process.env.NODEMAILER_EMAIL_USER,
            subject: "Network Test",
            text: "This is a network diagnostics test email.",
          },
          (error, info) => {
            if (error) {
              console.error("Email sending failed:", error);
              reject(error);
            } else {
              console.log("Test email sent:", info);
              resolve(info);
            }
          }
        );
      });

      return { strategy, testResult };
    } catch (error) {
      console.error("Strategy failed:", error);
      continue;
    }
  }

  throw new Error("All connection strategies failed");
}

// Run Advanced Diagnostics

// Additional Network Utilities
function getNetworkInfo() {
  const os = require("os");
  const networkInterfaces = os.networkInterfaces();
  console.log(
    "Network Interfaces:",
    JSON.stringify(networkInterfaces, null, 2)
  );
}
