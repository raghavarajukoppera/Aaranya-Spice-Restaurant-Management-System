import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { RestaurantProvider } from "@/context/RestaurantContext";
import ToastViewport from "@/components/ui/Toast";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Aaranya Spice | Restaurant Management System",
  description: "Where Every Meal Feels Like Home",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="font-body antialiased">
        <ToastProvider>
          <AuthProvider>
            <RestaurantProvider>
              {children}
              <ToastViewport />
            </RestaurantProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
