import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

interface DiscountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  discount: {
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
  };
}

export default function DiscountDetailsModal({
  isOpen,
  onClose,
  discount,
}: DiscountDetailsModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClaimDiscount = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/discounts/${discount.discount_id}/claim`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nie udało się odebrać zniżki");
      }

      alert("Zniżka została pomyślnie odebrana!");
      onClose();
    } catch (error) {
      console.error("Błąd podczas odbierania zniżki:", error);
      alert(
        "Wystąpił błąd podczas odbierania zniżki. Spróbuj ponownie później."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {discount.title}
                  </Dialog.Title>
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                    -{discount.percentage_discount}%
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {discount.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Cena oryginalna:
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {discount.normal_price} zł
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Cena po zniżce:
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {discount.discount_price} zł
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Lokalizacja:
                    </p>
                    <p className="text-sm text-gray-500">
                      {discount.location.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {discount.location.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Kategoria:
                    </p>
                    <p className="text-sm text-gray-500">
                      {discount.category.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Ważność:
                    </p>
                    <p className="text-sm text-gray-500">
                      od {new Date(discount.start_date).toLocaleDateString()} do{" "}
                      {new Date(discount.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
                      user
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                    onClick={handleClaimDiscount}
                    disabled={!user || isLoading}
                  >
                    {isLoading
                      ? "Przetwarzanie..."
                      : user
                      ? "Odbierz zniżkę"
                      : "Zaloguj się, aby odebrać zniżkę"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
