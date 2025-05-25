"use client";

import React, { useEffect, useState } from "react";
import DiscountCard from "@/components/DiscountCard";
import Navigation from "@/components/Navigation";
import { FaFilter } from "react-icons/fa";
import DiscountDetailModal from "@/components/DiscountDetailModal";

// Interfejsy na podstawie modeli backendowych
interface LocationFromAPI {
  location_id: number;
  name: string;
  address: string;
}

interface CategoryFromAPI {
  category_id: number;
  name: string;
}

interface UserFromAPI {
  user_id: number;
  username: string;
  first_name?: string;
  last_name?: string;
}

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
  location_id: number;
  category_id: number;
  created_by: number;
  promo_code?: string;
  location: LocationFromAPI;
  category: CategoryFromAPI;
  createdBy?: UserFromAPI;
}

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/discounts");
        if (!response.ok) {
          throw new Error("Failed to fetch discounts");
        }
        const data = await response.json();

        // **Poprawka: Konwersja cen na liczby**
        const formattedDiscounts = data.map((discount: any) => ({
          ...discount,
          normal_price: parseFloat(discount.normal_price),
          discount_price: parseFloat(discount.discount_price),
        }));

        setDiscounts(formattedDiscounts);

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

  const handleOpenModal = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDiscount(null);
  };

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
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
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
              locationName={discount.location.name}
              startDate={discount.start_date}
              endDate={discount.end_date}
              categoryName={discount.category.name}
              onDetailsClick={() => handleOpenModal(discount)}
            />
          ))}
        </div>

        {filteredDiscounts.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            Brak dostępnych zniżek w wybranej kategorii
          </div>
        )}
      </div>

      <DiscountDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        discount={selectedDiscount}
      />
    </div>
  );
};

export default DiscountsPage;
