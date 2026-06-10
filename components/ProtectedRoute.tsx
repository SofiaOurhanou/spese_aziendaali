"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, StoredUser } from "@/lib/api-client";
import { LoadingSpinner } from "./LoadingSpinner";

type Props = {
  children: React.ReactNode;
  ruoli?: Array<"DIPENDENTE" | "RESPONSABILE">;
};

export function ProtectedRoute({ children, ruoli }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null | undefined>(undefined);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    if (ruoli && !ruoli.includes(u.ruolo)) {
      router.replace("/dashboard");
      return;
    }
    setUser(u);
  }, [router, ruoli]);

  if (user === undefined) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}
