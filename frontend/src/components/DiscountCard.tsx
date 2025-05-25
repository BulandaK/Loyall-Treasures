import { FaMapMarkerAlt, FaCalendarAlt, FaTag } from "react-icons/fa";

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
}: DiscountCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{percentageDiscount}%
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center mb-4">
          <FaMapMarkerAlt className="text-gray-500 mr-2" />
          <span className="text-gray-700">{locationName}</span>{" "}
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
          <span className="text-gray-700">{categoryName}</span>{" "}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-green-600">
              {discountPrice.toFixed(2)} zł
            </span>
            <span className="ml-2 text-gray-500 line-through">
              {normalPrice.toFixed(2)} zł
            </span>
          </div>
          <button
            onClick={onDetailsClick}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300"
          >
            Szczegóły
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountCard;
