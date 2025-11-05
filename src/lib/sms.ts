import { StudentDetails } from "@/types/type";
import twilio from "twilio";

export default async function sendMessage(
  date: string,
  fromTime: string,
  toTime: string,
  studentDetails: StudentDetails
) {
  const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
  const token = <string>process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, token);
  const phone = <string>process.env.TWILIO_NUMBER;

  //TODO: Update SMS message
  // Dear Parent
  // Your ward was absent today (11-Dec-2024 ) in Anatomy class from 10 am to 11 am  class.
  //  Regards
  // Construct the SMS message
  const message = `
    Dear Parent,
  
    This is to inform you that your ward ${studentDetails.studentName} was absent on the following details:
    
    Phase: ${studentDetails.phase}
    Subject: ${studentDetails.subject}
    Batch: ${studentDetails.batch}
    Date: ${date}
    Time: ${fromTime} - ${toTime}
    
    Regards,
    [PIMS Absence Management System]
  `;

  try {
    const response = await client.messages.create({
      body: message,
      from: phone, // Use the Twilio number from your environment variable
      to: <string>process.env.TWILIO_SMS_TO_NUMBER, // Assuming you have the father's phone number in studentDetails
    });

    console.log("SMS sent: %s", response.sid);
  } catch (error) {
    console.error(`Error sending SMS!`, error);
  }
}
