"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SimpleJsonForm = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleDelete = async () => {
    const params = new URLSearchParams({
      academicYearId: "2024",
      academicPhaseId: "PHASE-123",
      academicSubjectId: "SUBJECT-456",
      batchId: "BATCH-789",
      date: "2024-03-19",
      fromTime: "09:00",
      toTime: "10:00",
    });

    try {
      const response = await fetch(`/api/attendance?${params.toString()}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete attendance");
      }

      const result = await response.json();
      console.log("Successfully deleted:", result);
      // Handle success (e.g., show notification, refresh data, etc.)
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("academicYear", "2023-24");
    formData.append("isActive", "true");
    formData.append("updatedAt", "2023-04-01 12:00:00");

    try {
      const params = new URLSearchParams({
        academicYearId: "fda61b9c-d8d8-4f3e-b61a-4f352a0fc000",
        academicPhaseId: "b8562f5f-e844-4d66-8205-2e78327aead7",
        academicSubjectId: "0ff0d00f-65ec-4daa-aad2-57de8f5a9f3c",
        batchId: "49a86210-0f63-476b-aa55-ee9acfd37508",
        date: "2024-12-19",
        fromTime: "09:00",
        toTime: "10:00",
      });

      const response = await fetch(
        `/api/academicAttendance/attendanceUpdation?${params.toString()}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete attendance");
      }

      const result = await response.json();
      console.log("Successfully deleted:", result);
      // Handle success (e.g., show notification, refresh data, etc.)
      // const response = await fetch("/api/phase", {
      //   method: "POST",
      //   // headers: { "Content-Type": "application/json" },
      //   // body: JSON.stringify(JSON.parse(jsonInput)), // Parse then stringify to validate JSON
      //   body: formData, // Parse then stringify to validate JSON
      // });

      // const response = await fetch("/api/attendance", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(JSON.parse(jsonInput)), // Parse then stringify to validate JSON
      //   // body: formData, // Parse then stringify to validate JSON
      // });

      // const response = await fetch("/api/batchAssignment", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(JSON.parse(jsonInput)), // Parse then stringify to validate JSON
      //   // body: formData, // Parse then stringify to validate JSON
      // });

      // const response = await fetch("/api/phaseSubject/copySubjectToPhase", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(JSON.parse(jsonInput)), // Parse then stringify to validate JSON
      // });

      // const response = await fetch("/api/student", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(JSON.parse(jsonInput)), // Parse then stringify to validate JSON
      //   // body: formData, // Parse then stringify to validate JSON
      // });

      // const response = await fetch("/api/academicYearAddPhase", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(JSON.parse(jsonInput)), // Parse then stringify to validate JSON
      //   // body: formData, // Parse then stringify to validate JSON
      // });

      // console.log("formData", formData);

      // const response = await fetch("/api/academicYear", {
      //   method: "POST",
      //   // headers: { "Content-Type": "application/json" },
      //   // body: JSON.stringify(JSON.parse(jsonInput)), // Parse then stringify to validate JSON
      //   body: formData, // Parse then stringify to validate JSON
      // });

      // const response = await fetch("/api/batchAssignment/updateBatch", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(JSON.parse(jsonInput)), // Parse then stringify to validate JSON
      //   // body: formData, // Parse then stringify to validate JSON
      // });

      if (!response.ok) {
        throw new Error(`Submission failed, ${response}`);
      }

      setStatus("Success!");
    } catch (err) {
      console.log("Error:", err);
      setStatus(
        err instanceof SyntaxError ? "Invalid JSON format" : "Error submitting"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>JSON Input</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full h-64 p-4 font-mono text-sm border rounded-md"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
          />

          {status && (
            <div
              className={`p-2 rounded ${
                status === "Success!"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {status}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleJsonForm;
