import { StarIcon } from "./Icons";

type RatingProps = {
  score: number;
  className?: string;
  starClassName?: string;
};

export function Rating({
  score,
  className = "",
  starClassName = "h-6 w-6",
}: RatingProps) {
  const roundedScore = Math.max(0, Math.min(5, Math.round(score)));

  return (
    <div
      className={`flex space-x-1 ${className}`}
      aria-label={`${score.toFixed(1)} de 5 estrelas`}
      role="img"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          aria-hidden="true"
          className={`${starClassName} ${
            index < roundedScore
              ? "text-accent drop-shadow-[0_0_5px_rgba(163,230,53,0.6)]"
              : "text-dark-subtle/20"
          }`}
        />
      ))}
    </div>
  );
}
