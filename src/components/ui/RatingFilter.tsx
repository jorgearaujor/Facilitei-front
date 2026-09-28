import { useState } from "react";
import { motion } from "framer-motion";
import { StarIcon } from "./Icons";

interface RatingFilterProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export function RatingFilter({ rating, onRatingChange }: RatingFilterProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRatingChange(star === rating ? 0 : star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${star} estrelas`}
            className={`focus:outline-none transition-colors duration-200 ${
              isActive
                ? "text-accent drop-shadow-[0_0_3px_rgba(163,230,53,0.6)]"
                : "text-white/20 hover:text-accent/50"
            }`}
          >
            <StarIcon className="h-6 w-6" />
          </motion.button>
        );
      })}
    </div>
  );
}
