// components/StudentTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudentTableProps {
   students : {
    rollNumber: number; // Required and an integer
    studentName: string; // Required
    enrollmentNumber: string; // Required
    admissionYear: number; // Required and an integer
    phase: string; // Required
    // Optional fields
    studentMobile?: string;
    fatherName?: string;
    fatherEmail?: string;
    fatherMobile?: string;
    motherName?: string;
    studentContactNo?: string;
    fatherContactNo?: string;
    motherMobile?: string;
  }[];
  // students: {
  //   phase: string;
  //   rollNumber: string;
  //   enrollmentNumber: string;
  //   studentName: string;
  //   fatherName: string;
  //   fatherContactNo: string;
  //   studentContactNo: string;
  //   fatherEmail: string;
  //   admissionYear: string;
  // }[];
}

export const StudentTable = ({ students }: StudentTableProps) => {
  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">
          Registered Students
        </CardTitle>
        <Button 
          variant="outline" 
          onClick={() => {
            // Convert students to CSV
            const headers = [
              'Phase', 'Roll', 'enrollmentNumber', 
              'No.', 'Name of student', 'Father Name', 
              'Father\'s Contact No', 'Student\'s Contact no', 
              'Father\'s email', 'Admission Year'
            ];

            const csvContent = [
              headers.join(','),
              ...students.map(student => [
                student.phase,
                student.rollNumber,
                student.enrollmentNumber,
                student.studentName,
                student.fatherName,
                student.fatherContactNo,
                student.studentContactNo,
                student.fatherEmail,
                student.admissionYear
              ].join(','))
            ].join('\n');

            // Create and download CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "registered_students.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Export to CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phase</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Enrollment No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Father's Name</TableHead>
                <TableHead>Father's Contact</TableHead>
                <TableHead>Student's Contact</TableHead>
                <TableHead>Father's Email</TableHead>
                <TableHead>Admission Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.phase}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.enrollmentNumber}</TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>{student.fatherName}</TableCell>
                  <TableCell>{student.fatherMobile}</TableCell>
                  <TableCell>{student.studentMobile}</TableCell>
                  <TableCell>{student.fatherEmail}</TableCell>
                  <TableCell>{student.admissionYear}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};