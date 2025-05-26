import Image from "next/image";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonColor: string;
}

const CategoryCard = ({
  title,
  description,
  image,
  buttonText,
  buttonColor,
}: CategoryCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full transition-shadow hover:shadow-xl">
      <div className="relative w-full h-48 sm:h-56 md:h-64 mb-4 rounded-lg overflow-hidden">
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-bold mt-2 text-[#030303]">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mt-1 mb-3 flex-grow">
          {description}
        </p>
      </div>
      <button
        className={`mt-auto ${buttonColor} text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity w-full sm:w-auto`} // mt-auto dla przycisku na dole, w-full na mobilnych
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CategoryCard;
