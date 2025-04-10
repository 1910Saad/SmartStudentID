import { useState } from "react";
import { StudentFormData, StudentData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface StudentFormProps {
  onSubmit: (studentData: StudentData) => void;
}

const ALLERGIES = [
  { id: "peanuts", label: "Peanuts" },
  { id: "dairy", label: "Dairy" },
  { id: "gluten", label: "Gluten" },
  { id: "seafood", label: "Seafood" },
  { id: "eggs", label: "Eggs" },
  { id: "soy", label: "Soy" },
];

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    rollNumber: "",
    class: "",
    allergies: [],
    photo: null,
    rackNumber: "",
    busRoute: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAllergiesChange = (allergy: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allergies: checked
        ? [...prev.allergies, allergy]
        : prev.allergies.filter(a => a !== allergy)
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Photo must be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
      setFormData(prev => ({ ...prev, photo: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.rollNumber || !formData.class || 
        !formData.rackNumber || !formData.busRoute || !formData.photo) {
      toast({
        title: "Missing required fields",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Convert photo to base64 for storage
    const photoBase64 = photoPreview as string;
    
    // Create the final student data to submit
    const studentData: StudentData = {
      ...formData,
      photo: photoBase64,
    };
    
    // Pass data to parent component
    onSubmit(studentData);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Student Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter student's full name"
              required
            />
          </div>

          {/* Roll Number Field */}
          <div>
            <Label htmlFor="rollNumber" className="text-sm font-medium text-gray-700 mb-1">
              Roll Number *
            </Label>
            <Input
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter roll number"
              required
            />
          </div>

          {/* Class & Division Field */}
          <div>
            <Label htmlFor="class" className="text-sm font-medium text-gray-700 mb-1">
              Class & Division *
            </Label>
            <Select
              value={formData.class}
              onValueChange={(value) => handleSelectChange("class", value)}
              required
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select class & division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1A">1A</SelectItem>
                <SelectItem value="1B">1B</SelectItem>
                <SelectItem value="2A">2A</SelectItem>
                <SelectItem value="2B">2B</SelectItem>
                <SelectItem value="3A">3A</SelectItem>
                <SelectItem value="3B">3B</SelectItem>
                <SelectItem value="4A">4A</SelectItem>
                <SelectItem value="4B">4B</SelectItem>
                <SelectItem value="5A">5A</SelectItem>
                <SelectItem value="5B">5B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Allergies Multi-Select */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1">
              Allergies (if any)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {ALLERGIES.map((allergy) => (
                <div key={allergy.id} className="flex items-center">
                  <Checkbox
                    id={`allergy-${allergy.id}`}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={formData.allergies.includes(allergy.label)}
                    onCheckedChange={(checked) => 
                      handleAllergiesChange(allergy.label, checked === true)
                    }
                  />
                  <Label 
                    htmlFor={`allergy-${allergy.id}`} 
                    className="ml-2 text-sm text-gray-700"
                  >
                    {allergy.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1">
              Photo Upload *
            </Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <Label
                        htmlFor="photo-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <Input
                          id="photo-upload"
                          name="photo"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handlePhotoChange}
                          required
                        />
                      </Label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                  </div>
                </div>
              </div>
              <div 
                className="w-24 h-32 bg-gray-100 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center"
              >
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-xs text-gray-500">Preview</span>
                )}
              </div>
            </div>
          </div>

          {/* Rack Number Field */}
          <div>
            <Label htmlFor="rackNumber" className="text-sm font-medium text-gray-700 mb-1">
              Rack Number *
            </Label>
            <Input
              id="rackNumber"
              name="rackNumber"
              value={formData.rackNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter rack number"
              required
            />
          </div>

          {/* Bus Route Number Field */}
          <div>
            <Label htmlFor="busRoute" className="text-sm font-medium text-gray-700 mb-1">
              Bus Route Number *
            </Label>
            <Select
              value={formData.busRoute}
              onValueChange={(value) => handleSelectChange("busRoute", value)}
              required
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select bus route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Route 1">Route 1</SelectItem>
                <SelectItem value="Route 2">Route 2</SelectItem>
                <SelectItem value="Route 3">Route 3</SelectItem>
                <SelectItem value="Route 4">Route 4</SelectItem>
                <SelectItem value="Route 5">Route 5</SelectItem>
                <SelectItem value="None">None (Walk/Parent Drop)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150"
            >
              Generate ID Card
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
