"use client";
import CategoryCard from "@/components/CategoryCard";
import Navigation from "@/components/Navigation";
import Image from "next/image";

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

      {/* Hero Section */}
      <section className="bg-white shadow-md mt-6 mx-6 rounded-lg p-6 flex items-center">
        <Image
          width={400}
          height={200}
          src="/bannerIcon.png"
          alt="banner icon"
        />
        <div className="text-left pl-20">
          <h2 className="text-3xl font-bold text-gray-800">
            Exclusive Discounts Await!
          </h2>
          <p className="text-gray-600 mt-2">
            Unlock massive savings on top brands across various categories. Join
            our community today!
          </p>
          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Explore Now
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </section>

      {/* Subscribe Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-700 text-white mx-6 rounded-lg p-8 text-left shadow-lg">
        <h3 className="text-3xl font-bold">Subscribe for Updates</h3>
        <p className="text-lg mt-2">
          Stay updated with the latest discounts and offers directly in your
          inbox or via SMS.
        </p>
        <div className="mt-6 flex justify-center items-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="border-none rounded-l-lg px-4 py-3 w-1/2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button className="bg-white text-green-600 font-bold px-6 py-3 rounded-r-lg hover:bg-gray-100 transition-all duration-300">
            Subscribe
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:underline">
              About Us
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Support
            </a>
          </div>
          <p>© 2023 DiscountsNow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
