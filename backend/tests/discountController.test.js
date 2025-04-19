const request = require("supertest");
const Discount = require("../models/discountModel");
const DiscountController = require("../controllers/discountController");

jest.mock("../models/discountModel");

describe("DiscountController", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllDiscounts", () => {
    it("should return all discounts with status 200", async () => {
      const mockDiscounts = [{ id: 1, name: "Discount 1" }];
      Discount.query.mockReturnValue({
        withGraphFetched: jest.fn().mockResolvedValue(mockDiscounts),
      });

      const mockReq = {};
      await DiscountController.getAllDiscounts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockDiscounts);
    });

    it("should handle errors and return status 500", async () => {
      Discount.query.mockReturnValue({
        withGraphFetched: jest
          .fn()
          .mockRejectedValue(new Error("Database error")),
      });

      const mockReq = {};
      await DiscountController.getAllDiscounts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error fetching discounts",
        error: expect.any(Error),
      });
    });
  });

  describe("getDiscountById", () => {
    it("should return a discount by ID with status 200", async () => {
      const mockDiscount = { id: 1, name: "Discount 1" };
      Discount.query.mockReturnValue({
        findById: jest.fn().mockReturnValue({
          withGraphFetched: jest.fn().mockResolvedValue(mockDiscount),
        }),
      });

      const mockReq = { params: { id: 1 } };
      await DiscountController.getDiscountById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockDiscount);
    });

    it("should return 404 if discount is not found", async () => {
      Discount.query.mockReturnValue({
        findById: jest.fn().mockReturnValue({
          withGraphFetched: jest.fn().mockResolvedValue(null),
        }),
      });

      const mockReq = { params: { id: 1 } };
      await DiscountController.getDiscountById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Discount not found",
      });
    });

    it("should handle errors and return status 500", async () => {
      Discount.query.mockReturnValue({
        findById: jest.fn().mockReturnValue({
          withGraphFetched: jest
            .fn()
            .mockRejectedValue(new Error("Database error")),
        }),
      });

      const mockReq = { params: { id: 1 } };
      await DiscountController.getDiscountById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error fetching discount",
        error: expect.any(Error),
      });
    });
  });

  describe("createDiscount", () => {
    it("should create a new discount and return it with status 201", async () => {
      const mockDiscount = { id: 1, name: "New Discount" };
      Discount.query.mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockDiscount),
      });

      const mockReq = { body: { name: "New Discount" } };
      await DiscountController.createDiscount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockDiscount);
    });

    it("should handle errors and return status 500", async () => {
      Discount.query.mockReturnValue({
        insert: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      const mockReq = { body: { name: "New Discount" } };
      await DiscountController.createDiscount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error creating discount",
        error: expect.any(Error),
      });
    });
  });

  describe("updateDiscount", () => {
    it("should update a discount and return it with status 200", async () => {
      const mockUpdatedDiscount = { id: 1, name: "Updated Discount" };
      Discount.query.mockReturnValue({
        patchAndFetchById: jest.fn().mockResolvedValue(mockUpdatedDiscount),
      });

      const mockReq = { params: { id: 1 }, body: { name: "Updated Discount" } };
      await DiscountController.updateDiscount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedDiscount);
    });

    it("should return 404 if discount to update is not found", async () => {
      Discount.query.mockReturnValue({
        patchAndFetchById: jest.fn().mockResolvedValue(null),
      });

      const mockReq = { params: { id: 1 }, body: { name: "Updated Discount" } };
      await DiscountController.updateDiscount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Discount not found",
      });
    });

    it("should handle errors and return status 500", async () => {
      Discount.query.mockReturnValue({
        patchAndFetchById: jest
          .fn()
          .mockRejectedValue(new Error("Database error")),
      });

      const mockReq = { params: { id: 1 }, body: { name: "Updated Discount" } };
      await DiscountController.updateDiscount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error updating discount",
        error: expect.any(Error),
      });
    });
  });

  describe("deleteDiscount", () => {
    it("should delete a discount and return status 200", async () => {
      Discount.query.mockReturnValue({
        deleteById: jest.fn().mockResolvedValue(1),
      });

      const mockReq = { params: { id: 1 } };
      await DiscountController.deleteDiscount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Discount deleted successfully",
      });
    });

    it("should return 404 if discount to delete is not found", async () => {
      Discount.query.mockReturnValue({
        deleteById: jest.fn().mockResolvedValue(0),
      });

      const mockReq = { params: { id: 1 } };
      await DiscountController.deleteDiscount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Discount not found",
      });
    });

    it("should handle errors and return status 500", async () => {
      Discount.query.mockReturnValue({
        deleteById: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      const mockReq = { params: { id: 1 } };
      await DiscountController.deleteDiscount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error deleting discount",
        error: expect.any(Error),
      });
    });
  });
});
