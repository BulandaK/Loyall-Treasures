import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Category {
  category_id: number;
  name: string;
}

interface Location {
  location_id: number;
  name: string;
  address: string;
}

interface AddDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (discount: any) => void;
  categories: Category[];
  locations: Location[];
  onCategoryAdd: (category: Category) => void;
  onLocationAdd: (location: Location) => void;
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  categories,
  locations,
  onCategoryAdd,
  onLocationAdd,
}) => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [newDiscount, setNewDiscount] = useState({
    title: "Test Discount",
    description: "This is a test discount description",
    normal_price: "100.00",
    discount_price: "75.00",
    percentage_discount: "25",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    is_active: true,
    location_id: "",
    category_id: "",
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
  });

  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
  });

  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [showNewLocationForm, setShowNewLocationForm] = useState(false);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const user = JSON.parse(userData);
      const token = user.token;

      const response = await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const category = await response.json();
        onCategoryAdd(category);
        setNewCategory({ name: "" });
        setShowNewCategoryForm(false);
      } else {
        setError("Failed to create category");
      }
    } catch (error) {
      setError("Error creating category");
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const user = JSON.parse(userData);
      const token = user.token;

      const response = await fetch("http://localhost:8080/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLocation),
      });

      if (response.ok) {
        const location = await response.json();
        onLocationAdd(location);
        setNewLocation({ name: "", address: "" });
        setShowNewLocationForm(false);
      } else {
        setError("Failed to create location");
      }
    } catch (error) {
      setError("Error creating location");
    }
  };

  const validateForm = () => {
    if (!newDiscount.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!newDiscount.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (
      !newDiscount.normal_price ||
      parseFloat(newDiscount.normal_price) <= 0
    ) {
      setError("Normal price must be greater than 0");
      return false;
    }
    if (
      !newDiscount.discount_price ||
      parseFloat(newDiscount.discount_price) <= 0
    ) {
      setError("Discount price must be greater than 0");
      return false;
    }
    if (
      parseFloat(newDiscount.discount_price) >=
      parseFloat(newDiscount.normal_price)
    ) {
      setError("Discount price must be less than normal price");
      return false;
    }
    if (
      !newDiscount.percentage_discount ||
      parseInt(newDiscount.percentage_discount) <= 0 ||
      parseInt(newDiscount.percentage_discount) > 100
    ) {
      setError("Percentage discount must be between 1 and 100");
      return false;
    }
    if (!newDiscount.start_date) {
      setError("Start date is required");
      return false;
    }
    if (!newDiscount.end_date) {
      setError("End date is required");
      return false;
    }
    if (new Date(newDiscount.end_date) <= new Date(newDiscount.start_date)) {
      setError("End date must be after start date");
      return false;
    }
    if (!newDiscount.location_id) {
      setError("Location is required");
      return false;
    }
    if (!newDiscount.category_id) {
      setError("Category is required");
      return false;
    }
    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setNewDiscount({
      ...newDiscount,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const discountData = {
      ...newDiscount,
      normal_price: parseFloat(newDiscount.normal_price),
      discount_price: parseFloat(newDiscount.discount_price),
      percentage_discount: parseInt(newDiscount.percentage_discount),
      location_id: parseInt(newDiscount.location_id),
      category_id: parseInt(newDiscount.category_id),
      created_by: user?.id,
    };

    onAdd(discountData);
    setNewDiscount({
      title: "Test Discount",
      description: "This is a test discount description",
      normal_price: "100.00",
      discount_price: "75.00",
      percentage_discount: "25",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      is_active: true,
      location_id: "",
      category_id: "",
    });
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">
            Add New Discount
          </h2>
          <button onClick={onClose} className="text-black hover:text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={newDiscount.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Description
              </label>
              <textarea
                name="description"
                value={newDiscount.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Normal Price
              </label>
              <input
                type="number"
                name="normal_price"
                value={newDiscount.normal_price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Discount Price
              </label>
              <input
                type="number"
                name="discount_price"
                value={newDiscount.discount_price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Percentage Discount
              </label>
              <input
                type="number"
                name="percentage_discount"
                value={newDiscount.percentage_discount}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                required
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={newDiscount.start_date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={newDiscount.end_date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-black">
                  Location
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewLocationForm(!showNewLocationForm)}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  {showNewLocationForm ? "Cancel" : "+ Add New Location"}
                </button>
              </div>
              {showNewLocationForm ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Location Name"
                    value={newLocation.name}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={newLocation.address}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        address: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleCreateLocation}
                    className="w-full px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Create Location
                  </button>
                </div>
              ) : (
                <select
                  name="location_id"
                  value={newDiscount.location_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                  required
                >
                  <option value="">Select a location</option>
                  {locations.map((location) => (
                    <option
                      key={location.location_id}
                      value={location.location_id}
                    >
                      {location.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-black">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  {showNewCategoryForm ? "Cancel" : "+ Add New Category"}
                </button>
              </div>
              {showNewCategoryForm ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="w-full px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Create Category
                  </button>
                </div>
              ) : (
                <select
                  name="category_id"
                  value={newDiscount.category_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={newDiscount.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Active</label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Create Discount
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDiscountModal;
