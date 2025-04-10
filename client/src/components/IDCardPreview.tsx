import React, { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as htmlToImage from "html-to-image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StudentData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface IDCardPreviewProps {
  studentData: StudentData | null;
}

const IDCardPreview: React.FC<IDCardPreviewProps> = ({ studentData }) => {
  const [template, setTemplate] = useState<"template1" | "template2">("template1");
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!cardRef.current || !studentData) return;

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2
      });
      
      const link = document.createElement("a");
      link.download = `${studentData.name.replace(/\s+/g, "_")}_ID_Card.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Success",
        description: "ID card has been downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating the image",
        variant: "destructive"
      });
    }
  };

  // Format allergies for display
  const formatAllergies = (allergies: string[]): string => {
    return allergies.length > 0 ? allergies.join(", ") : "None";
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">ID Card Preview</h2>
          
          {/* Template Switcher */}
          <div className="flex items-center space-x-3">
            <Label htmlFor="template-switcher" className="text-sm font-medium text-gray-700">
              Template:
            </Label>
            <Select
              value={template}
              onValueChange={(value) => setTemplate(value as "template1" | "template2")}
            >
              <SelectTrigger id="template-switcher" className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary focus:border-primary">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template1">Classic</SelectItem>
                <SelectItem value="template2">Modern</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Template 1: Classic Design */}
        {template === "template1" && (
          <div 
            ref={cardRef}
            className="id-card-template block max-w-sm mx-auto"
          >
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
              {/* Header */}
              <div className="bg-primary text-white py-3 px-4 text-center relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">UNITY SCHOOL</h3>
                <p className="text-xs">STUDENT IDENTIFICATION CARD</p>
              </div>
              
              {/* Card Body */}
              <div className="p-4">
                <div className="flex">
                  {/* Photo Section */}
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-24 h-32 bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden">
                      {studentData?.photo ? (
                        <img 
                          src={studentData.photo} 
                          alt="Student" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-xs text-gray-500">Photo</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Info Section */}
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800">
                      {studentData?.name || "Student Name"}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      Class: <span>{studentData?.class || "--"}</span>
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      Roll No: <span>{studentData?.rollNumber || "--"}</span>
                    </p>
                    
                    <div className="text-sm mt-3">
                      <p className="text-gray-600 mb-1">
                        Rack #: <span>{studentData?.rackNumber || "--"}</span>
                      </p>
                      <p className="text-gray-600">
                        Bus Route: <span>{studentData?.busRoute || "--"}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Allergy Section */}
                <div className="mt-3 border-t pt-2 border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Allergies:</p>
                  <p className="text-sm text-gray-600">
                    {studentData ? formatAllergies(studentData.allergies) : "None"}
                  </p>
                </div>
                
                {/* QR Code Section */}
                <div className="mt-4 flex justify-center border-t pt-4 border-gray-200">
                  <div className="h-24 w-24 flex items-center justify-center">
                    {studentData ? (
                      <QRCodeSVG 
                        value={JSON.stringify(studentData)}
                        size={96}
                        level="M"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">QR Code</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-100 py-2 px-4 text-xs text-center text-gray-600">
                <p>If found, please return to Unity School</p>
                <p>123 Education Ave, Knowledge City</p>
              </div>
            </div>
          </div>
        )}

        {/* Template 2: Modern Design */}
        {template === "template2" && (
          <div 
            ref={cardRef}
            className="id-card-template max-w-sm mx-auto"
          >
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
              {/* Header */}
              <div className="bg-gradient-to-r from-secondary to-blue-500 text-white pt-6 pb-16 px-4 text-center">
                <h3 className="font-bold text-xl tracking-wide">UNITY SCHOOL</h3>
                <p className="text-xs uppercase tracking-wider mt-1">Student ID • 2023-2024</p>
              </div>
              
              {/* Photo Container - Elevated */}
              <div className="flex justify-center -mt-12 mb-2">
                <div className="w-24 h-32 bg-white border-2 border-white shadow-lg rounded-md overflow-hidden">
                  {studentData?.photo ? (
                    <img 
                      src={studentData.photo} 
                      alt="Student" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="flex items-center justify-center h-full text-xs text-gray-500">Photo</span>
                  )}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="px-4 pt-2 pb-4 text-center">
                <p className="font-bold text-xl text-gray-800">
                  {studentData?.name || "Student Name"}
                </p>
                <div className="flex justify-center gap-6 mt-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-500">Class:</span>
                    <span className="text-gray-800"> {studentData?.class || "--"}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-500">Roll No:</span>
                    <span className="text-gray-800"> {studentData?.rollNumber || "--"}</span>
                  </p>
                </div>
                
                {/* Details Section */}
                <div className="grid grid-cols-2 gap-2 mt-4 bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase">Rack Number</p>
                    <p className="font-medium text-gray-800">
                      {studentData?.rackNumber || "--"}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase">Bus Route</p>
                    <p className="font-medium text-gray-800">
                      {studentData?.busRoute || "--"}
                    </p>
                  </div>
                </div>
                
                {/* Allergy Section */}
                <div className="mt-3 bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 uppercase text-left">Allergies</p>
                  <p className="text-sm text-gray-800 text-left">
                    {studentData ? formatAllergies(studentData.allergies) : "None"}
                  </p>
                </div>
                
                {/* QR Code Section */}
                <div className="mt-4 flex justify-center">
                  <div className="h-28 w-28 bg-white p-2 rounded-lg shadow-sm flex items-center justify-center">
                    {studentData ? (
                      <QRCodeSVG 
                        value={JSON.stringify(studentData)}
                        size={96}
                        level="M"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">QR Code</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-800 py-2 px-4 text-xs text-center text-gray-300">
                <p>If found, please return to Unity School • 123 Education Ave, Knowledge City</p>
              </div>
            </div>
          </div>
        )}

        {/* Download Button */}
        <div className="mt-6 text-center">
          <Button 
            onClick={handleDownload}
            disabled={!studentData}
            className="bg-secondary text-white py-2 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download as PNG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IDCardPreview;
