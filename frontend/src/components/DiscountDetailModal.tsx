"use client";

import React from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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

interface DiscountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  discount: Discount | null;
}

const DiscountDetailModal: React.FC<DiscountDetailModalProps> = ({
  isOpen,
  onClose,
  discount,
}) => {
  const { user } = useAuth();
  const router = useRouter();

  if (!isOpen || !discount) {
    return null;
  }

  const handleRedeemDiscount = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/redemptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          discount_id: discount.discount_id,
          location_id: discount.location_id,
        }),
      });

      if (response.ok) {
        const redemptionData = await response.json();
        alert(
          `Zniżka "${discount.title}" została odebrana! ID Odbioru: ${redemptionData.redemption_id}`
        );
        onClose();
      } else {
        const errorData = await response.json();
        alert(
          `Błąd podczas odbierania zniżki: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Error redeeming discount:", error);
      alert("Wystąpił błąd podczas próby odebrania zniżki.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{discount.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 text-base leading-relaxed">
            {discount.description}
          </p>

          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="text-green-600 mr-3" size={20} />
            <span>
              {discount.location.name}
              {discount.location.address && `, ${discount.location.address}`}
            </span>
          </div>

          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="text-green-600 mr-3" size={20} />
            <span>
              Dostępna od: {new Date(discount.start_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="text-green-600 mr-3" size={20} />
            <span>
              Dostępna do: {new Date(discount.end_date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-gray-700">
            <FaTag className="text-green-600 mr-3" size={20} />
            <span>Kategoria: {discount.category.name}</span>
          </div>

          {discount.createdBy && (
            <p className="text-sm text-gray-500">
              Dodane przez:{" "}
              {discount.createdBy.first_name || discount.createdBy.username}
            </p>
          )}

          {discount.promo_code && (
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="text-sm text-gray-600">Kod promocyjny:</p>
              <p className="text-lg font-semibold text-green-700">
                {discount.promo_code}
              </p>
            </div>
          )}

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-3xl font-bold text-green-600">
                  {/* Upewnijmy się, że wartość jest liczbą przed toFixed */}
                  {typeof discount.discount_price === "number"
                    ? discount.discount_price.toFixed(2)
                    : "N/A"}{" "}
                  zł
                </span>
                <span className="ml-2 text-lg text-gray-500 line-through">
                  {typeof discount.normal_price === "number"
                    ? discount.normal_price.toFixed(2)
                    : "N/A"}{" "}
                  zł
                </span>
              </div>
              <span className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-semibold">
                -{discount.percentage_discount}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-300"
          >
            Zamknij
          </button>
          {user ? (
            <button
              onClick={handleRedeemDiscount}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
            >
              Odbierz Zniżkę
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Zaloguj się, aby odebrać
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountDetailModal;
