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
  FaSpinner, // Dodano ikonę ładowania
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface LocationFromAPI {
  location_id: number;
  name: string;
  address: string;
  city_id: number; // Zakładam, że te pola mogą być potrzebne
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
  description: string; // Zakładam, że te pola mogą być potrzebne
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
  const [isLoadingRedeem, setIsLoadingRedeem] = useState(false); // Stan ładowania dla odbierania zniżki

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

  const handleRedeemDiscount = async () => {
    if (!user || !user.token || !discount) {
      alert("Musisz być zalogowany, aby odebrać zniżkę.");
      if (!user) router.push("/auth/login");
      return;
    }
    if (isCurrentlyRedeemed || isLoadingRedeem) {
      return;
    }

    setIsLoadingRedeem(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/redemptions`, // Endpoint backendu do odbierania zniżek
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Używamy tokenu zalogowanego użytkownika
          },
          body: JSON.stringify({
            user_id: user.id,
            discount_id: discount.discount_id,
            location_id: discount.location_id, // Backend może wymagać location_id
            // used_code: discount.promo_code || null, // Jeśli jest kod promocyjny
          }),
        }
      );

      if (response.ok) {
        setIsCurrentlyRedeemed(true);
        alert("Zniżka została pomyślnie odebrana!");
        onClose(true, discount.discount_id); // Przekazujemy informację, że zniżka została odebrana
      } else {
        const errorData = await response.json();
        alert(
          `Nie udało się odebrać zniżki: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Błąd podczas odbierania zniżki:", error);
      alert(
        "Wystąpił błąd podczas odbierania zniżki. Spróbuj ponownie później."
      );
    } finally {
      setIsLoadingRedeem(false);
    }
  };

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
          // alert("Usunięto z ulubionych!"); // Można odkomentować
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
            // user_id: user.id, // Backend odczytuje user_id z tokenu, więc nie musimy wysyłać
            discount_id: discount.discount_id,
          }),
        });
        if (response.ok) {
          setIsFavorite(true);
          // alert("Dodano do ulubionych!"); // Można odkomentować
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
      alert("Wystąpił błąd podczas operacji na ulubionych.");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      {" "}
      {/* Zmieniono bg-opacity-50 na 60 */}
      <div className="bg-white rounded-lg p-6 md:p-8 max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-xl">
        {" "}
        {/* Zmniejszono max-w-2xl na max-w-lg, zwiększono max-h */}
        {/* Nagłówek Modala */}
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mr-4 break-words">
            {discount.title}
          </h2>
          <div className="flex items-center space-x-2">
            {user && (
              <button
                onClick={handleToggleFavorite}
                disabled={isLoadingFavorite}
                className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  isLoadingFavorite
                    ? "cursor-wait animate-pulse text-gray-400"
                    : ""
                } ${
                  isFavorite
                    ? "text-red-500 hover:bg-red-100 focus:ring-red-400"
                    : "text-gray-400 hover:bg-gray-100 hover:text-red-500 focus:ring-gray-400"
                }`}
                aria-label={
                  isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
                }
              >
                {isLoadingFavorite ? (
                  <FaSpinner className="animate-spin" size={22} />
                ) : isFavorite ? (
                  <FaHeart size={22} />
                ) : (
                  <FaRegHeart size={22} />
                )}
              </button>
            )}
            <button
              onClick={() => onClose()}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              aria-label="Zamknij modal"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>
        {/* Treść Modala */}
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {discount.description}
          </p>

          {/* Sekcja cenowa */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-green-600">
                  {typeof discount.discount_price === "number"
                    ? discount.discount_price.toFixed(2)
                    : "N/A"}{" "}
                  zł
                </span>
                {typeof discount.normal_price === "number" &&
                  discount.normal_price > 0 && (
                    <span className="ml-2 text-base text-gray-500 line-through">
                      {discount.normal_price.toFixed(2)} zł
                    </span>
                  )}
              </div>
              <span className="bg-green-500 text-white px-3 py-1 sm:px-4 rounded-full text-sm sm:text-base font-semibold">
                -{discount.percentage_discount}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
            <div className="flex items-start text-gray-700">
              <FaMapMarkerAlt
                className="text-green-600 mr-2 mt-1 flex-shrink-0"
                size={18}
              />
              <div>
                <span className="font-medium block">
                  {discount.location.name}
                </span>
                {discount.location.address && (
                  <span className="text-sm text-gray-600">
                    {discount.location.address}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-start text-gray-700">
              <FaTag
                className="text-green-600 mr-2 mt-1 flex-shrink-0"
                size={18}
              />
              <div>
                <span className="font-medium block">Kategoria</span>
                <span className="text-sm text-gray-600">
                  {discount.category.name}
                </span>
              </div>
            </div>
            <div className="flex items-start text-gray-700">
              <FaCalendarAlt
                className="text-green-600 mr-2 mt-1 flex-shrink-0"
                size={18}
              />
              <div>
                <span className="font-medium block">Dostępna od</span>
                <span className="text-sm text-gray-600">
                  {new Date(discount.start_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-start text-gray-700">
              <FaCalendarAlt
                className="text-green-600 mr-2 mt-1 flex-shrink-0"
                size={18}
              />
              <div>
                <span className="font-medium block">Dostępna do</span>
                <span className="text-sm text-gray-600">
                  {new Date(discount.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {discount.promo_code && (
            <div className="bg-gray-100 p-3 rounded-md mt-2">
              <p className="text-sm text-gray-600 mb-0.5">Kod promocyjny:</p>
              <p className="text-lg font-semibold text-green-700 tracking-wider bg-white inline-block px-2 py-1 rounded">
                {discount.promo_code}
              </p>
            </div>
          )}
        </div>
        {/* Stopka Modala z Akcjami */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => onClose()}
            className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-colors duration-200 text-sm sm:text-base"
          >
            Zamknij
          </button>
          {user ? (
            isCurrentlyRedeemed ? (
              <button
                disabled
                className="px-5 py-2.5 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
              >
                <FaCheckCircle className="mr-2" /> Odebrane
              </button>
            ) : (
              <button
                onClick={handleRedeemDiscount}
                disabled={isLoadingRedeem}
                className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoadingRedeem ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : null}
                {isLoadingRedeem ? "Odbieranie..." : "Odbierz Zniżkę"}
              </button>
            )
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200 text-sm sm:text-base"
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
