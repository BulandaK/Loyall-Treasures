// Przykładowe dane użytkowników (można zastąpić bazą danych)
const users = [
  { id: 1, name: "Jan Kowalski", email: "jan@example.com" },
  { id: 2, name: "Anna Nowak", email: "anna@example.com" },
];

// Pobranie użytkownika po ID
exports.getUserById = (id) => {
  return users.find((user) => user.id === id);
};

// Pobranie wszystkich użytkowników
exports.getAllUsers = () => {
  return users;
};

// Dodanie nowego użytkownika
exports.addUser = (user) => {
  const newUser = { id: users.length + 1, ...user };
  users.push(newUser);
  return newUser;
};

// Aktualizacja użytkownika
exports.updateUser = (id, updatedData) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedData };
    return users[userIndex];
  }
  return null;
};

// Usunięcie użytkownika
exports.deleteUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1);
    return deletedUser[0];
  }
  return null;
};
