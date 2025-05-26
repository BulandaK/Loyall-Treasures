"use client";

import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaTimes,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface LocationFromAPI {
  location_id: number;
  name: string;
  address: string;
  city_id: number;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  is_active: boolean;
  created_at: string;
}

interface CategoryFromAPI {
  category_id: number;
  name: string;
  description: string;
  icon: string;
}

interface UserFromAPI {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  created_at: string;
  last_login: string;
  is_active: boolean;
}

interface Discount {
  discount_id: number;
  title: string;
  description: string;
  normal_price: number | string;
  discount_price: number | string;
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
  onClose: (wasRedeemed?: boolean, redeemedDiscountId?: number) => void;
  discount: Discount | null;
  isRedeemed: boolean;
  initialIsFavorite?: boolean;
  onFavoriteToggle?: (discountId: number, isFavorite: boolean) => void;
}

const DiscountDetailModal: React.FC<DiscountDetailModalProps> = ({
  isOpen,
  onClose,
  discount,
  isRedeemed: initialIsRedeemed,
  initialIsFavorite = false,
  onFavoriteToggle,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isCurrentlyRedeemed, setIsCurrentlyRedeemed] =
    React.useState(initialIsRedeemed);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  React.useEffect(() => {
    setIsCurrentlyRedeemed(initialIsRedeemed);
  }, [initialIsRedeemed]);

  useEffect(() => {
    if (discount) {
      setIsFavorite(initialIsFavorite);
    }
  }, [discount, initialIsFavorite, user]);

  if (!isOpen || !discount) {
    return null;
  }

  const handleRedeemDiscount = async () => {};

  const handleToggleFavorite = async () => {
    if (!user || !user.token || !discount) {
      alert("Musisz być zalogowany, aby zarządzać ulubionymi.");
      if (!user) router.push("/auth/login");
      return;
    }
    if (isLoadingFavorite) return;

    setIsLoadingFavorite(true);
    const apiUrlBase = `http://localhost:8080/api/favorites`;

    try {
      let response;
      if (isFavorite) {
        response = await fetch(
          `${apiUrlBase}/users/${user.id}/${discount.discount_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (response.ok) {
          setIsFavorite(false);
          alert("Usunięto z ulubionych!");
          if (onFavoriteToggle) onFavoriteToggle(discount.discount_id, false);
        } else {
          const errorData = await response.json();
          alert(
            `Nie udało się usunąć z ulubionych: ${
              errorData.message || response.statusText
            }`
          );
        }
      } else {
        response = await fetch(apiUrlBase, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            discount_id: discount.discount_id,
          }),
        });
        if (response.ok) {
          setIsFavorite(true);
          alert("Dodano do ulubionych!");
          if (onFavoriteToggle) onFavoriteToggle(discount.discount_id, true);
        } else {
          const errorData = await response.json();
          alert(
            `Nie udało się dodać do ulubionych: ${
              errorData.message || response.statusText
            }`
          );
        }
      }
    } catch (error) {
      console.error("Błąd podczas operacji na ulubionych:", error);
      alert("Wystąpił błąd.");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{discount.title}</h2>
          {user && (
            <button
              onClick={handleToggleFavorite}
              disabled={isLoadingFavorite}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isLoadingFavorite ? "cursor-wait animate-pulse" : ""
              } ${
                isFavorite
                  ? "text-red-500 hover:bg-red-100"
                  : "text-gray-400 hover:bg-gray-100 hover:text-red-500"
              }`}
              aria-label={
                isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
              }
            >
              {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
            </button>
          )}
          <button
            onClick={() => onClose()}
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
            onClick={() => onClose()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-300"
          >
            Zamknij
          </button>
          {user ? (
            isCurrentlyRedeemed ? (
              <button
                disabled
                className="px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed flex items-center"
              >
                <FaCheckCircle className="mr-2" /> Odebrane
              </button>
            ) : (
              <button
                onClick={handleRedeemDiscount}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
              >
                Odbierz Zniżkę
              </button>
            )
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
