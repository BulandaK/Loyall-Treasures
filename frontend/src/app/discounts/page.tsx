"use client";

import React, { useEffect, useState } from "react";
import DiscountCard from "@/components/DiscountCard";
import Navigation from "@/components/Navigation";
import { FaFilter } from "react-icons/fa";
import DiscountDetailModal from "@/components/DiscountDetailModal";
import { useAuth } from "@/context/AuthContext";

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

interface Redemption {
  redemption_id: number;
  user_id: number;
  discount_id: number;
  redeemed_at: string;
}

const DiscountsPage = () => {
  const { user } = useAuth();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const [redeemedDiscountIds, setRedeemedDiscountIds] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/discounts");
        if (!response.ok) {
          throw new Error("Failed to fetch discounts");
        }
        const data = await response.json();
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

  useEffect(() => {
    const fetchRedeemedDiscounts = async () => {
      if (user && user.id && user.token) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/redemptions/users/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (response.ok) {
            const redeemed: Redemption[] = await response.json();
            const ids = new Set(redeemed.map((r) => r.discount_id));
            setRedeemedDiscountIds(ids);
          } else {
            console.error("Failed to fetch redeemed discounts");
          }
        } catch (error) {
          console.error("Error fetching redeemed discounts:", error);
        }
      } else {
        setRedeemedDiscountIds(new Set());
      }
    };

    fetchRedeemedDiscounts();
  }, [user]);

  const handleOpenModal = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsModalOpen(true);
  };

  const handleCloseModal = (
    wasRedeemed: boolean = false,
    redeemedDiscountId?: number
  ) => {
    setIsModalOpen(false);
    setSelectedDiscount(null);
    if (wasRedeemed && redeemedDiscountId) {
      setRedeemedDiscountIds((prevIds) =>
        new Set(prevIds).add(redeemedDiscountId)
      );
    }
  };

  const filteredDiscounts =
    selectedCategory === "all"
      ? discounts
      : discounts.filter(
          (discount) => discount.category.name === selectedCategory
        );

  if (loading && discounts.length === 0) {
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
              isRedeemed={
                user ? redeemedDiscountIds.has(discount.discount_id) : false
              }
            />
          ))}
        </div>

        {filteredDiscounts.length === 0 && !loading && (
          <div className="text-center text-gray-600 mt-8">
            Brak dostępnych zniżek w wybranej kategorii
          </div>
        )}
      </div>

      {selectedDiscount && (
        <DiscountDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          discount={selectedDiscount}
          isRedeemed={
            user ? redeemedDiscountIds.has(selectedDiscount.discount_id) : false
          }
        />
      )}
    </div>
  );
};

export default DiscountsPage;
