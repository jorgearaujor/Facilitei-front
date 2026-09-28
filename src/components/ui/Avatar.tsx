import { useEffect, useState } from "react";

interface AvatarProps {
  src?: string | null;
  name?: string;
  className?: string;
}

export function Avatar({ src, name = "Usuário", className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";

  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden bg-primary/20 text-primary font-bold ${className}`}>
      {src?.trim() && !failed ? (
        <img src={src} alt={name} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span aria-label={name} role="img">{initials}</span>
      )}
    </div>
  );
}
