"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import AddDiscountModal from "@/components/AddDiscountModal";

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
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
  location: {
    name: string;
  };
  category: {
    name: string;
  };
}

interface Category {
  category_id: number;
  name: string;
}

interface Location {
  location_id: number;
  name: string;
  address: string;
}

const AdminPanel = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDiscountModalOpen, setIsAddDiscountModalOpen] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          router.push("/");
          return;
        }
        const user = JSON.parse(userData);
        console.log(user);
        if (user.role_id === 1) {
          setIsAdmin(true);
          fetchData();
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        router.push("/login");
      }
    };
    checkAdminRole();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }
      const user = JSON.parse(userData);
      const token = user.token;

      const [
        usersResponse,
        discountsResponse,
        categoriesResponse,
        locationsResponse,
      ] = await Promise.all([
        fetch("http://localhost:8080/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:8080/api/discounts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:8080/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:8080/api/locations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (
        usersResponse.ok &&
        discountsResponse.ok &&
        categoriesResponse.ok &&
        locationsResponse.ok
      ) {
        const [usersData, discountsData, categoriesData, locationsData] =
          await Promise.all([
            usersResponse.json(),
            discountsResponse.json(),
            categoriesResponse.json(),
            locationsResponse.json(),
          ]);
        setUsers(usersData);
        setDiscounts(discountsData);
        setCategories(categoriesData);
        setLocations(locationsData);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      setError("Error fetching data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId: number, isActive: boolean) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }
      const user = JSON.parse(userData);
      const token = user.token;

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_active: isActive }),
        }
      );

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.user_id === userId ? { ...user, is_active: isActive } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      return;
    }

    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }
      const user = JSON.parse(userData);
      const token = user.token;

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.user_id !== userId));
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDiscountStatusChange = async (
    discountId: number,
    isActive: boolean
  ) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }
      const user = JSON.parse(userData);
      const token = user.token;

      const response = await fetch(
        `http://localhost:8080/api/discounts/${discountId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_active: isActive }),
        }
      );

      if (response.ok) {
        setDiscounts(
          discounts.map((discount) =>
            discount.discount_id === discountId
              ? { ...discount, is_active: isActive }
              : discount
          )
        );
      }
    } catch (error) {
      console.error("Error updating discount status:", error);
    }
  };

  const handleAddDiscount = async (discountData: any) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }
      const user = JSON.parse(userData);
      const token = user.token;

      const response = await fetch("http://localhost:8080/api/discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(discountData),
      });

      if (response.ok) {
        const newDiscount = await response.json();

        // Fetch the complete discount data with relations
        const discountResponse = await fetch(
          `http://localhost:8080/api/discounts/${newDiscount.discount_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (discountResponse.ok) {
          const completeDiscount = await discountResponse.json();
          setDiscounts([...discounts, completeDiscount]);
          setIsAddDiscountModalOpen(false);
        } else {
          console.error("Failed to fetch complete discount data");
        }
      } else {
        console.error("Failed to create discount");
      }
    } catch (error) {
      console.error("Error creating discount:", error);
    }
  };

  const handleAddCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const handleAddLocation = (location: Location) => {
    setLocations([...locations, location]);
  };

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="p-8">
          <div className="text-center text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="p-8">
          <div className="text-center text-xl font-semibold text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === "users"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "discounts"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("discounts")}
            >
              Discounts
            </button>
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.user_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleUserStatusChange(
                                user.user_id,
                                !user.is_active
                              )
                            }
                            className={`px-3 py-1 rounded ${
                              user.is_active
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {user.is_active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.user_id)}
                            className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Discounts Tab */}
        {activeTab === "discounts" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Discount Management</h2>
              <button
                onClick={() => setIsAddDiscountModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add New Discount
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {discounts.map((discount) => (
                    <tr key={discount.discount_id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {discount.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {discount.category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {discount.location.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {discount.discount_price} zł
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          {discount.normal_price} zł
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            discount.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {discount.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleDiscountStatusChange(
                              discount.discount_id,
                              !discount.is_active
                            )
                          }
                          className={`px-3 py-1 rounded ${
                            discount.is_active
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {discount.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AddDiscountModal
          isOpen={isAddDiscountModalOpen}
          onClose={() => setIsAddDiscountModalOpen(false)}
          onAdd={handleAddDiscount}
          categories={categories}
          locations={locations}
          onCategoryAdd={handleAddCategory}
          onLocationAdd={handleAddLocation}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
