"use client";
import CategoryCard from "@/components/CategoryCard";
import Navigation from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const categories = [
    {
      id: 1,
      title: "Home Decor",
      description: "Up to 70% off on select items",
      image: "/homeDecor.png",
      buttonText: "Shop Now",
      buttonColor: "bg-[#FF784B]",
    },
    {
      id: 2,
      title: "Fashion",
      description: "New arrivals at 50% off",
      image: "/fashion.jpg",
      buttonText: "Discover",
      buttonColor: "bg-orange-500",
    },
    {
      id: 3,
      title: "Electronics",
      description: "Save big on tech gadgets",
      image: "/electronics.png",
      buttonText: "Grab Deals",
      buttonColor: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <section className="bg-white shadow-md mt-4 sm:mt-6 mx-2 sm:mx-4 md:mx-6 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row items-center md:space-x-6">
        <div className="w-full md:w-1/3 lg:w-1/4 mb-4 md:mb-0 flex justify-center">
          <Image
            width={300}
            height={200}
            src="/bannerIcon.png"
            alt="Ikona baneru Loyall Treasures"
            className="object-contain max-h-[120px] sm:max-h-[150px] md:max-h-full rounded-md"
          />
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Ekskluzywne zniżki czekają!
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Odkryj masywne oszczędności na najlepszych markach w różnych
            kategoriach. Dołącz do naszej społeczności już dziś!
          </p>
          <button className="mt-4 bg-green-600 text-white px-5 py-2 sm:px-6 rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base">
            <Link href="/discounts">Odkryj teraz</Link>
          </button>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Popularne Kategorie
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              description={category.description}
              image={category.image}
              buttonText={category.buttonText}
              buttonColor={category.buttonColor}
            />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-500 to-green-700 text-white mx-2 sm:mx-4 md:mx-6 rounded-lg p-6 sm:p-8 text-center shadow-lg">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Subskrybuj aktualizacje
        </h3>
        <p className="text-base sm:text-lg mt-2">
          Bądź na bieżąco z najnowszymi zniżkami i ofertami bezpośrednio w swoim
          e-mailu lub SMS.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-stretch sm:items-center max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Wpisz swój email"
            className="border-none rounded-lg sm:rounded-l-lg sm:rounded-r-none px-4 py-3 w-full sm:flex-grow focus:outline-none focus:ring-2 focus:ring-green-300 mb-3 sm:mb-0 text-gray-800"
          />
          <button className="bg-white text-green-600 font-bold px-6 py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base">
            Subskrybuj
          </button>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8 mt-10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6 mb-4 text-sm">
            <a href="#" className="hover:underline">
              O nas
            </a>
            <a href="#" className="hover:underline">
              Warunki serwisu
            </a>
            <a href="#" className="hover:underline">
              Polityka prywatności
            </a>
            <a href="#" className="hover:underline">
              Wsparcie
            </a>
          </div>
          <p className="text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Loyall. Wszystkie prawa
            zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
}
