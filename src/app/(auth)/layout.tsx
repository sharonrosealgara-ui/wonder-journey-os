import Link from "next/link";
import { brand } from "@/config/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl text-ocean-deep">
            <span className="text-3xl">🧭</span>
            {brand.productName}
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
