import { useState, useRef } from "react";
import StudentForm from "@/components/StudentForm";
import IDCardPreview from "@/components/IDCardPreview";
import PreviousCardsList from "@/components/PreviousCardsList";
import { StudentData } from "@/lib/types";
import { saveStudentCard } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [currentStudentData, setCurrentStudentData] = useState<StudentData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFormSubmit = (studentData: StudentData) => {
    // Set the current student data for preview
    setCurrentStudentData(studentData);
    
    // Save to localStorage
    saveStudentCard(studentData);
    
    // Show success toast
    toast({
      title: "ID Card Generated",
      description: "Student ID card has been generated successfully"
    });
  };

  const handleViewCard = (card: StudentData) => {
    setCurrentStudentData(card);
    
    // Scroll to the card preview
    setTimeout(() => {
      const previewElement = document.getElementById("id-card-preview");
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Unity Student ID Generator</h1>
        <p className="text-gray-600 mt-2">Create, preview, and download professional student ID cards</p>
      </header>

      {/* Main content container with responsive layout */}
      <div className="lg:flex lg:gap-8">
        {/* Student Form */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <StudentForm onSubmit={handleFormSubmit} />
        </div>

        {/* ID Card Preview and Saved Cards */}
        <div className="lg:w-1/2">
          <div id="id-card-preview" className="mb-8">
            <IDCardPreview 
              studentData={currentStudentData} 
              ref={cardRef}
            />
          </div>
          
          <PreviousCardsList 
            onViewCard={handleViewCard}
            currentCardRef={cardRef}
          />
        </div>
      </div>
    </div>
  );
}
