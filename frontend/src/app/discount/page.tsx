"use client";

import { useEffect, useState } from "react";
import DiscountCard from "@/components/DiscountCard";

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
    address: string;
  };
  category: {
    name: string;
  };
}

export default function DiscountPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/discounts`
        );
        if (!response.ok) {
          throw new Error("Nie udało się pobrać zniżek");
        }
        const data = await response.json();
        console.log("Odpowiedź API:", data);
        setDiscounts(data);
      } catch (err) {
        setError("Wystąpił błąd podczas ładowania zniżek");
        console.error("Błąd podczas pobierania zniżek:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Błąd!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dostępne zniżki</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discounts.map((discount) => (
          <DiscountCard key={discount.discount_id} discount={discount} />
        ))}
      </div>

      {discounts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Brak dostępnych zniżek</p>
        </div>
      )}
    </div>
  );
}
