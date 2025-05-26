"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import DiscountCard from "@/components/DiscountCard";
import Navigation from "@/components/Navigation";
import DiscountDetailModal from "@/components/DiscountDetailModal";
import { useRouter } from "next/navigation";
import { FaHeart, FaSearch } from "react-icons/fa"; // Dodano FaSearch

// --- Definicje interfejsów (powinny być spójne i najlepiej w osobnym pliku types.ts) ---
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

interface UserFavoriteFromAPI {
  favorite_id: number;
  user_id: number;
  discount_id: number;
  added_at: string;
  // Zakładamy, że backend NIE zwraca już pełnego obiektu discount,
  // zgodnie z prośbą o filtrowanie po stronie klienta.
  // Jeśli backend zwraca pełny obiekt, ten interfejs powinien to odzwierciedlać.
}

interface Redemption {
  redemption_id: number;
  user_id: number;
  discount_id: number;
  redeemed_at: string;
}
// --- Koniec definicji interfejsów ---

const FavoritesPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [allDiscounts, setAllDiscounts] = useState<Discount[]>([]);
  const [favoriteDiscountIds, setFavoriteDiscountIds] = useState<Set<number>>(
    new Set()
  );
  const [displayedFavorites, setDisplayedFavorites] = useState<Discount[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const [redeemedDiscountIds, setRedeemedDiscountIds] = useState<Set<number>>(
    new Set()
  );

  const fetchAllDiscounts = useCallback(async () => {
    // Ta funkcja nie powinna ustawiać błędu globalnego, jeśli jest częścią większego procesu ładowania
    try {
      const response = await fetch("http://localhost:8080/api/discounts");
      if (!response.ok) {
        console.error(
          "Failed to fetch all discounts, status:",
          response.status
        );
        throw new Error("Nie udało się pobrać wszystkich zniżek.");
      }
      const data = await response.json();
      const formattedDiscounts = data.map((discount: any) => ({
        ...discount,
        normal_price: parseFloat(discount.normal_price),
        discount_price: parseFloat(discount.discount_price),
      }));
      setAllDiscounts(formattedDiscounts);
      return formattedDiscounts;
    } catch (err: any) {
      console.error("Błąd pobierania wszystkich zniżek:", err);
      // Nie ustawiamy tutaj globalnego błędu, aby fetchUserFavoriteIds mogło kontynuować
      return [];
    }
  }, []);

  const fetchUserFavoriteIds = useCallback(
    async (token: string, userId: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/favorites/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "Failed to fetch favorite IDs, status:",
            response.status,
            errorData
          );
          throw new Error(
            errorData.message || "Nie udało się pobrać ID ulubionych zniżek."
          );
        }
        const favData: UserFavoriteFromAPI[] = await response.json();
        const ids = new Set(favData.map((fav) => fav.discount_id));
        setFavoriteDiscountIds(ids);
        return ids;
      } catch (err: any) {
        console.error("Błąd pobierania ID ulubionych:", err);
        // Nie ustawiamy tutaj globalnego błędu, aby fetchAllDiscounts mogło kontynuować
        return new Set<number>();
      }
    },
    []
  );

  useEffect(() => {
    const loadData = async () => {
      if (user?.id && user.token) {
        setLoading(true);
        setError(null); // Resetuj błąd przed próbą pobrania

        // Równoległe pobieranie danych
        const [discountsResult, favIdsResult] = await Promise.allSettled([
          fetchAllDiscounts(),
          fetchUserFavoriteIds(user.token, user.id),
        ]);

        let discountsData: Discount[] = [];
        if (discountsResult.status === "fulfilled") {
          discountsData = discountsResult.value;
        } else {
          console.error("fetchAllDiscounts rejected:", discountsResult.reason);
          setError(
            discountsResult.reason?.message || "Błąd pobierania zniżek."
          );
          setLoading(false);
          return;
        }

        let favIdsData: Set<number> = new Set();
        if (favIdsResult.status === "fulfilled") {
          favIdsData = favIdsResult.value;
        } else {
          console.error("fetchUserFavoriteIds rejected:", favIdsResult.reason);
          setError(
            favIdsResult.reason?.message || "Błąd pobierania ulubionych."
          );
          // Możemy zdecydować, czy chcemy kontynuować, jeśli ulubione się nie załadują
        }

        if (discountsData.length > 0 && favIdsData.size > 0) {
          const filteredFavorites = discountsData.filter((discount: Discount) =>
            favIdsData.has(discount.discount_id)
          );
          setDisplayedFavorites(filteredFavorites);
        } else {
          setDisplayedFavorites([]);
        }
        setLoading(false);
      } else if (!user) {
        setLoading(false);
        setDisplayedFavorites([]);
        setFavoriteDiscountIds(new Set());
      }
    };

    loadData();
  }, [user, fetchAllDiscounts, fetchUserFavoriteIds]);

  useEffect(() => {
    if (user?.id && user.token) {
      const fetchRedeemed = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/redemptions/users/${user.id}`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          if (response.ok) {
            const redeemed: Redemption[] = await response.json();
            setRedeemedDiscountIds(new Set(redeemed.map((r) => r.discount_id)));
          }
        } catch (error) {
          console.error("Error fetching redeemed discounts for modal:", error);
        }
      };
      fetchRedeemed();
    }
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
      setRedeemedDiscountIds((prev) => new Set(prev).add(redeemedDiscountId));
    }
  };

  const handleFavoriteStatusChange = (
    discountId: number,
    isNowFavorite: boolean
  ) => {
    setFavoriteDiscountIds((prevIds) => {
      const newSet = new Set(prevIds);
      if (isNowFavorite) {
        newSet.add(discountId);
        const newlyFavoritedDiscount = allDiscounts.find(
          (d) => d.discount_id === discountId
        );
        if (
          newlyFavoritedDiscount &&
          !displayedFavorites.some((df) => df.discount_id === discountId)
        ) {
          setDisplayedFavorites((prevDisp) => [
            ...prevDisp,
            newlyFavoritedDiscount,
          ]);
        }
      } else {
        newSet.delete(discountId);
        setDisplayedFavorites((prevDisp) =>
          prevDisp.filter((d) => d.discount_id !== discountId)
        );
      }
      return newSet;
    });
  };

  // ---- ZMIANY WIZUALNE ----
  const pageBackgroundColor =
    "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50"; // Delikatny gradient
  const headerTextColor = "text-rose-600";
  const ctaButtonColor = "bg-rose-500 hover:bg-rose-600";
  // ---- KONIEC ZMIAN WIZUALNYCH ----

  if (loading) {
    return (
      <div className={`min-h-screen ${pageBackgroundColor} flex flex-col`}>
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="p-8 text-center text-xl font-semibold text-gray-700">
            Ładowanie Twoich ulubionych skarbów...
          </div>
        </div>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className={`min-h-screen ${pageBackgroundColor} flex flex-col`}>
        <Navigation />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <div className="text-center p-8 sm:p-12 bg-white rounded-xl shadow-2xl max-w-lg">
            <FaHeart
              className={`mx-auto text-6xl sm:text-7xl mb-6 text-rose-400`}
            />
            <h1
              className={`text-3xl sm:text-4xl font-bold ${headerTextColor} mb-4`}
            >
              Twoje Ulubione Skarby
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Zaloguj się, aby zobaczyć zapisane przez Ciebie okazje i perełki!
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className={`w-full sm:w-auto ${ctaButtonColor} text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg transform hover:scale-105`}
            >
              Zaloguj się
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${pageBackgroundColor} flex flex-col`}>
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="p-8 text-center text-xl font-semibold text-red-600 bg-red-50 rounded-lg shadow-md">
            <p>Wystąpił błąd:</p>
            <p className="text-base mt-2">{error}</p>
            <button
              onClick={() => {
                // Próba ponownego załadowania danych
                if (user?.id && user.token) {
                  fetchUserFavoriteIds(user.token, user.id);
                  fetchAllDiscounts();
                }
              }}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBackgroundColor} flex flex-col`}>
      <Navigation />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 text-center sm:text-left">
          <div className="flex items-center mb-4 sm:mb-0">
            <FaHeart
              className={`mr-3 text-4xl sm:text-5xl ${headerTextColor}`}
            />
            <h1
              className={`text-4xl sm:text-5xl font-extrabold ${headerTextColor} tracking-tight`}
            >
              Moje Ulubione
            </h1>
          </div>
          {/* Można dodać np. licznik ulubionych */}
          {displayedFavorites.length > 0 && (
            <div className="text-lg text-gray-600">
              Liczba ulubionych:{" "}
              <span className={`font-bold ${headerTextColor}`}>
                {displayedFavorites.length}
              </span>
            </div>
          )}
        </div>

        {displayedFavorites.length === 0 && !loading && (
          <div className="text-center py-16 px-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
            <FaSearch className="mx-auto text-6xl text-rose-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Nie masz jeszcze ulubionych!
            </h2>
            <p className="text-gray-500 mb-8">
              Przeglądaj zniżki i klikaj serduszko, aby dodać je tutaj i łatwo
              do nich wracać.
            </p>
            <button
              onClick={() => router.push("/discounts")}
              className={`w-full sm:w-auto ${ctaButtonColor} text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg transform hover:scale-105`}
            >
              Odkrywaj Zniżki
            </button>
          </div>
        )}

        {displayedFavorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {displayedFavorites.map((discount) => {
              if (!discount || !discount.location || !discount.category) {
                console.warn("Ulubiona zniżka ma niekompletne dane:", discount);
                return (
                  <div
                    key={discount?.discount_id || Math.random()}
                    className="bg-white rounded-lg shadow-md p-6 text-red-500 border border-red-200 flex items-center justify-center h-full"
                  >
                    <p>Błąd ładowania danych tej zniżki.</p>
                  </div>
                );
              }
              return (
                <div
                  key={discount.discount_id}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <DiscountCard
                    title={discount.title}
                    description={discount.description}
                    normalPrice={parseFloat(discount.normal_price as any)}
                    discountPrice={parseFloat(discount.discount_price as any)}
                    percentageDiscount={discount.percentage_discount}
                    locationName={discount.location.name}
                    startDate={discount.start_date}
                    endDate={discount.end_date}
                    categoryName={discount.category.name}
                    onDetailsClick={() => handleOpenModal(discount)}
                    isRedeemed={
                      user
                        ? redeemedDiscountIds.has(discount.discount_id)
                        : false
                    }
                    discountId={discount.discount_id}
                    initialIsFavorite={true} // Na tej stronie wszystkie są ulubione
                    onFavoriteToggle={handleFavoriteStatusChange}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="py-8 mt-10 text-center text-gray-500 border-t border-gray-200">
        Loyall Treasures &copy; {new Date().getFullYear()}
      </footer>

      {selectedDiscount &&
        selectedDiscount.location &&
        selectedDiscount.category && (
          <DiscountDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            discount={selectedDiscount}
            isRedeemed={
              user
                ? redeemedDiscountIds.has(selectedDiscount.discount_id)
                : false
            }
            initialIsFavorite={favoriteDiscountIds.has(
              selectedDiscount.discount_id
            )}
            onFavoriteToggle={handleFavoriteStatusChange}
          />
        )}
    </div>
  );
};

export default FavoritesPage;
