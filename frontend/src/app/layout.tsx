import "./globals.css";
import { Poppins, Roboto } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Loyall Treasures - Twoje Centrum Zniżek",
  description: "Odkrywaj najlepsze zniżki i promocje w Loyall Treasures.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <div className="flex-grow">{children}</div>{" "}
        </AuthProvider>
      </body>
    </html>
  );
}
