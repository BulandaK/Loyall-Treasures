// Przykładowe dane zniżek (można zastąpić bazą danych)
const discounts = [
  { id: 1, store: "Sklep A", discount: "10%" },
  { id: 2, store: "Sklep B", discount: "20%" },
];

// Pobranie zniżki po ID
exports.getDiscountById = (id) => {
  return discounts.find((discount) => discount.id === id);
};

// Pobranie wszystkich zniżek
exports.getAllDiscounts = () => {
  return discounts;
};

// Dodanie nowej zniżki
exports.addDiscount = (discount) => {
  const newDiscount = { id: discounts.length + 1, ...discount };
  discounts.push(newDiscount);
  return newDiscount;
};

// Aktualizacja zniżki
exports.updateDiscount = (id, updatedData) => {
  const discountIndex = discounts.findIndex((discount) => discount.id === id);
  if (discountIndex !== -1) {
    discounts[discountIndex] = { ...discounts[discountIndex], ...updatedData };
    return discounts[discountIndex];
  }
  return null;
};

// Usunięcie zniżki
exports.deleteDiscount = (id) => {
  const discountIndex = discounts.findIndex((discount) => discount.id === id);
  if (discountIndex !== -1) {
    const deletedDiscount = discounts.splice(discountIndex, 1);
    return deletedDiscount[0];
  }
  return null;
};
