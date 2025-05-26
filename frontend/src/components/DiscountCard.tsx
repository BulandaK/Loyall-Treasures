// frontend/src/components/DiscountCard.tsx
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DiscountCardProps {
  title: string;
  description: string;
  normalPrice: number;
  discountPrice: number;
  percentageDiscount: number;
  locationName: string;
  startDate: string;
  endDate: string;
  categoryName: string;
  onDetailsClick: () => void;
  isRedeemed: boolean;
  discountId: number; // Kluczowe: ID zniżki
  initialIsFavorite?: boolean; // Początkowy stan ulubionego, przekazywany z góry
  onFavoriteToggle?: (discountId: number, isFavorite: boolean) => void;
}

const DiscountCard = ({
  title,
  description,
  normalPrice,
  discountPrice,
  percentageDiscount,
  locationName,
  startDate,
  endDate,
  categoryName,
  onDetailsClick,
  isRedeemed,
  discountId,
  initialIsFavorite = false, // Domyślna wartość, jeśli nie przekazano
  onFavoriteToggle,
}: DiscountCardProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  // Synchronizuj stan isFavorite z propsem initialIsFavorite, gdy się zmieni
  // (np. gdy lista ulubionych na stronie nadrzędnej zostanie zaktualizowana)
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Zapobiega kliknięciu na całą kartę
    if (!user || !user.token) {
      alert("Musisz być zalogowany, aby zarządzać ulubionymi.");
      router.push("/auth/login");
      return;
    }
    if (isLoadingFavorite) return;

    // Sprawdzenie, czy discountId jest poprawną liczbą
    if (typeof discountId !== "number" || isNaN(discountId)) {
      console.error(
        "DiscountCard: handleToggleFavorite - discountId is invalid:",
        discountId
      );
      alert("Błąd: ID zniżki jest nieprawidłowe.");
      return;
    }

    setIsLoadingFavorite(true);
    const apiUrlBase = `http://localhost:8080/api/favorites`;

    try {
      let response;
      if (isFavorite) {
        // Usuwanie z ulubionych
        response = await fetch(`${apiUrlBase}/users/${user.id}/${discountId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          setIsFavorite(false); // Zaktualizuj lokalny stan
          // alert('Usunięto z ulubionych!'); // Opcjonalny alert
          if (onFavoriteToggle) {
            onFavoriteToggle(discountId, false); // Poinformuj komponent nadrzędny
          }
        } else {
          const errorData = await response.json();
          console.error("Error removing favorite:", errorData);
          alert(
            `Nie udało się usunąć z ulubionych: ${
              errorData.message || response.statusText
            }`
          );
        }
      } else {
        // Dodawanie do ulubionych
        response = await fetch(apiUrlBase, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ discount_id: discountId }), // Backend oczekuje discount_id
        });
        if (response.ok) {
          setIsFavorite(true); // Zaktualizuj lokalny stan
          // alert('Dodano do ulubionych!'); // Opcjonalny alert
          if (onFavoriteToggle) {
            onFavoriteToggle(discountId, true); // Poinformuj komponent nadrzędny
          }
        } else {
          const errorData = await response.json();
          console.error("Error adding favorite:", errorData);
          alert(
            `Nie udało się dodać do ulubionych: ${
              errorData.message || response.statusText
            }`
          );
        }
      }
    } catch (error) {
      console.error("Błąd podczas operacji na ulubionych:", error);
      alert("Wystąpił błąd sieciowy lub serwera.");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 ${
        isRedeemed ? "opacity-70" : "hover:shadow-lg"
      } relative cursor-pointer`} // Dodano cursor-pointer, jeśli cała karta jest klikalna
      onClick={onDetailsClick} // Jeśli cała karta ma otwierać modal
    >
      {user && (
        <button
          onClick={handleToggleFavorite}
          disabled={isLoadingFavorite}
          className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors duration-200 z-10 ${
            isLoadingFavorite ? "cursor-wait animate-pulse" : ""
          } ${
            isFavorite
              ? "text-red-500 bg-red-100 hover:bg-red-200"
              : "text-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-red-500"
          }`}
          aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        >
          {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </button>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          {/* Upewniamy się, że tytuł nie jest zasłaniany przez przycisk serca */}
          <h3 className="text-xl font-bold text-gray-800 mr-10">{title}</h3>
          <span
            className={`text-white px-3 py-1 rounded-full text-sm font-semibold ${
              isRedeemed ? "bg-gray-400" : "bg-green-500"
            }`}
          >
            -{percentageDiscount}%
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center mb-4">
          <FaMapMarkerAlt className="text-gray-500 mr-2" />
          <span className="text-gray-700">{locationName}</span>
        </div>

        <div className="flex items-center mb-4">
          <FaCalendarAlt className="text-gray-500 mr-2" />
          <span className="text-gray-700">
            {new Date(startDate).toLocaleDateString()} -{" "}
            {new Date(endDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center mb-4">
          <FaTag className="text-gray-500 mr-2" />
          <span className="text-gray-700">{categoryName}</span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-baseline">
            <span
              className={`text-2xl font-bold ${
                isRedeemed ? "text-gray-500" : "text-green-600"
              }`}
            >
              {typeof discountPrice === "number"
                ? discountPrice.toFixed(2)
                : "N/A"}{" "}
              zł
            </span>
            <span className="ml-2 text-gray-500 line-through">
              {typeof normalPrice === "number" ? normalPrice.toFixed(2) : "N/A"}{" "}
              zł
            </span>
          </div>

          {/* <button
            onClick={onDetailsClick} // To może być redundantne, jeśli cała karta jest klikalna
            className={`text-white px-4 py-2 rounded transition-colors duration-300 ${
              isRedeemed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isRedeemed}
          >
            {isRedeemed ? "Odebrana" : "Szczegóły"}
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default DiscountCard;
