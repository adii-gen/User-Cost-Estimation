// Update the Student type in your types/type.ts file
export type Student = {
  id: string;
  rollNumber: string; // Ensure this matches the API response
  admissionYear: string;
  name: string;
  currentPhaseId: string;
  fatherName: string;
  fatherMobile: string;
  fatherEmail: string;
  motherName: string | null;
  motherMobile: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

  
  export interface TimeSlot {
    start: string;
    end: string;
  }
  
  export interface AttendanceRecord {
    roll_no: string;
    phase: string;
    date: string;
    status: 'P' | 'A';
    time_slot: string;
    subject_name: string;
    lectureType: string;
  }
  
  export interface PreviewData {
    absentStudents: Student[];
    presentStudents: Student[];
    subject: string;
    attendanceDate: string;
  }

  export type StudentDetails = {
  studentName: string;
  fatherEmail: string;
  fatherName: string;
  fatherMobile: string;
  phase: string;
  subject: string;
  batch: string;
}