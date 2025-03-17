const discountModel = require("../models/discountModel");

exports.getDiscountById = (req, res) => {
  const discountId = parseInt(req.params.id);
  const discount = discountModel.getDiscountById(discountId);

  if (discount) {
    res.status(200).json(discount);
  } else {
    res.status(404).json({ message: "Discount not found" });
  }
};

exports.getAllDiscounts = (req, res) => {
  const discounts = discountModel.getAllDiscounts();
  res.status(200).json(discounts);
};

exports.addDiscount = (req, res) => {
  const newDiscount = discountModel.addDiscount(req.body);
  res.status(201).json(newDiscount);
};

exports.updateDiscount = (req, res) => {
  const discountId = parseInt(req.params.id);
  const updatedDiscount = discountModel.updateDiscount(discountId, req.body);

  if (updatedDiscount) {
    res.status(200).json(updatedDiscount);
  } else {
    res.status(404).json({ message: "Discount not found" });
  }
};

exports.deleteDiscount = (req, res) => {
  const discountId = parseInt(req.params.id);
  const deletedDiscount = discountModel.deleteDiscount(discountId);

  if (deletedDiscount) {
    res.status(200).json(deletedDiscount);
  } else {
    res.status(404).json({ message: "Discount not found" });
  }
};
