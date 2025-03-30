
import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface ReviewProps {
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
}

const Review: React.FC<ReviewProps> = ({ name, role, rating, comment, date }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
          <span className="text-sm text-muted-foreground ml-2">{rating.toFixed(1)}</span>
        </div>
        <p className="mb-4 text-sm italic">"{comment}"</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const CustomerReviews = () => {
  const reviews = [
    {
      name: "Michael Chen",
      role: "Day Trader",
      rating: 5,
      comment: "ProfitPilot has completely transformed my trading strategy. The signals are consistently accurate and the UI is intuitive.",
      date: "May 2025"
    },
    {
      name: "Sarah Johnson",
      role: "Swing Trader",
      rating: 4.5,
      comment: "The technical analysis provided is exceptional. I've increased my returns by 27% since using ProfitPilot.",
      date: "April 2025"
    },
    {
      name: "David Williams",
      role: "Crypto Investor",
      rating: 5,
      comment: "The economic calendar feature alone is worth the subscription. I never miss important market events anymore.",
      date: "June 2025"
    },
    {
      name: "Emma Rodriguez",
      role: "Professional Trader",
      rating: 4.5,
      comment: "Having both iOS and desktop apps makes it easy to stay on top of markets wherever I am. Top-notch product.",
      date: "March 2025"
    }
  ];

  return (
    <div className="py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Trusted by Professional Traders</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See why thousands of traders rely on ProfitPilot for their market analysis and trading decisions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {reviews.map((review, index) => (
          <Review key={index} {...review} />
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
