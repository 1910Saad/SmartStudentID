import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentData } from "@/lib/types";
import { getSavedCards } from "@/lib/localStorage";
import * as htmlToImage from "html-to-image";
import { useToast } from "@/hooks/use-toast";

interface PreviousCardsListProps {
  onViewCard: (card: StudentData) => void;
  currentCardRef: React.RefObject<HTMLDivElement>;
}

const PreviousCardsList: React.FC<PreviousCardsListProps> = ({ 
  onViewCard, 
  currentCardRef 
}) => {
  const [savedCards, setSavedCards] = useState<StudentData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved cards from localStorage
    setSavedCards(getSavedCards());
  }, []);

  // Function to handle refreshing the list (e.g., after adding a new card)
  const refreshList = () => {
    setSavedCards(getSavedCards());
  };

  // Call refreshList every time the component is focused or mounts
  useEffect(() => {
    refreshList();
    window.addEventListener("focus", refreshList);
    return () => {
      window.removeEventListener("focus", refreshList);
    };
  }, []);

  const handleViewCard = (card: StudentData) => {
    onViewCard(card);
  };

  const handleDownloadCard = async (card: StudentData) => {
    // First view the card to ensure it's rendered
    onViewCard(card);
    
    // Small delay to ensure the card is rendered
    setTimeout(async () => {
      if (!currentCardRef.current) return;

      try {
        const dataUrl = await htmlToImage.toPng(currentCardRef.current, {
          quality: 1.0,
          pixelRatio: 2
        });
        
        const link = document.createElement("a");
        link.download = `${card.name.replace(/\s+/g, "_")}_ID_Card.png`;
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
    }, 500);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Previously Generated Cards</h2>
        
        {savedCards.length === 0 ? (
          <div className="text-center py-8 text-gray-500 italic">
            No saved cards yet. Generate your first ID card above.
          </div>
        ) : (
          <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
            {savedCards.map((card) => (
              <div 
                key={card.id} 
                className="p-3 hover:bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{card.name}</p>
                  <p className="text-sm text-gray-500">
                    Class {card.class} • Roll No: {card.rollNumber}
                    {card.createdAt && ` • ${formatDate(card.createdAt)}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost"
                    onClick={() => handleViewCard(card)}
                    className="text-primary hover:text-blue-700 text-sm font-medium"
                  >
                    View
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => handleDownloadCard(card)}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviousCardsList;
