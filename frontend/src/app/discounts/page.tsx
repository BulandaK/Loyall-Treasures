"use client";

import React, { useEffect, useState } from "react";
import DiscountCard from "@/components/DiscountCard";
import Navigation from "@/components/Navigation";
import { FaFilter } from "react-icons/fa";

interface Discount {
  discount_id: number;
  title: string;
  description: string;
  normal_price: number;
  discount_price: number;
  percentage_discount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  location: {
    name: string;
  };
  category: {
    name: string;
  };
}

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/discounts");
        if (!response.ok) {
          throw new Error("Failed to fetch discounts");
        }
        const data = await response.json();
        setDiscounts(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((discount: Discount) => discount.category.name))
        ) as string[];
        setCategories(uniqueCategories);
      } catch (err) {
        setError("Wystąpił błąd podczas ładowania zniżek");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const filteredDiscounts =
    selectedCategory === "all"
      ? discounts
      : discounts.filter(
          (discount) => discount.category.name === selectedCategory
        );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="p-8">
          <div className="text-center text-xl font-semibold">Ładowanie...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="p-8">
          <div className="text-center text-xl font-semibold text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dostępne Zniżki</h1>
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Wszystkie kategorie</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiscounts.map((discount) => (
            <DiscountCard
              key={discount.discount_id}
              title={discount.title}
              description={discount.description}
              normalPrice={discount.normal_price}
              discountPrice={discount.discount_price}
              percentageDiscount={discount.percentage_discount}
              location={discount.location.name}
              startDate={discount.start_date}
              endDate={discount.end_date}
              category={discount.category.name}
            />
          ))}
        </div>

        {filteredDiscounts.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            Brak dostępnych zniżek w wybranej kategorii
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountsPage;
