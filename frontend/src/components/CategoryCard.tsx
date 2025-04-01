import Image from "next/image";

const CategoryCard = ({
  title,
  description,
  image,
  buttonText,
  buttonColor,
}: any) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <Image
        src={image}
        alt={title}
        width={400}
        height={400}
        className="rounded-lg"
      />
      <h3 className="text-xl font-bold mt-4 text-[#030303]">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <button
        className={`mt-4 ${buttonColor} text-white px-4 py-2 rounded hover:bg-orange-600`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CategoryCard;
