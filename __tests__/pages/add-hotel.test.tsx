// __tests__/pages/add-hotel.test.tsx
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor, fireEvent } from "../test-utils";
import userEvent from "@testing-library/user-event";
import AddHotelPage from "../../src/app/hotels/add/page";

// Mock the Next.js useRouter hook
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Test Helper Functions
const getFormElements = () => ({
  nameInput: screen.getAllByLabelText(/Hotel Name/i)[0],
  priceInput: screen.getAllByLabelText(/Price/i)[0],
  ratingInput: screen.getAllByLabelText(/Rating/i)[0],
  currencySelect: document.getElementById("currency") as HTMLButtonElement,
  submitButton: screen.getAllByText(/Submit & Compare/i)[0],
});

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  data: {
    name?: string;
    price?: string;
    rating?: string;
    currency?: string;
  },
  clearFirst = true,
) => {
  const { nameInput, priceInput, ratingInput, currencySelect } =
    getFormElements();

  if (clearFirst) {
    await user.clear(nameInput);
    await user.clear(priceInput);
    await user.clear(ratingInput);
  }

  if (data.name !== undefined) await user.type(nameInput, data.name);
  if (data.price !== undefined) await user.type(priceInput, data.price);
  if (data.rating !== undefined) await user.type(ratingInput, data.rating);
  if (data.currency && currencySelect) {
    // Use fireEvent consistently
    fireEvent.click(currencySelect);
    const options = await screen.findAllByRole("option");
    const targetOption = options.find((opt) =>
      opt.textContent?.includes(data.currency!),
    );
    if (targetOption) {
      fireEvent.click(targetOption);
    }
  }
};

const mockLocalStorageSetItem = () => {
  const originalSetItem = localStorage.setItem;
  let savedData: string | null = null;
  localStorage.setItem = vi.fn((key, value) => {
    if (key === "hotels") {
      savedData = value;
    }
    return originalSetItem.call(localStorage, key, value);
  });
  return { originalSetItem, getSavedData: () => savedData };
};

const waitForFormUpdate = () =>
  new Promise((resolve) => setTimeout(resolve, 100));

describe("AddHotelPage", () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    mockPush.mockClear();
    cleanup();
  });

  it("renders the add hotel form", () => {
    render(<AddHotelPage />);

    expect(screen.getAllByText("Add Hotel Information")[0]).toBeTruthy();
    const { nameInput, priceInput, ratingInput, submitButton } =
      getFormElements();
    expect(nameInput).toBeTruthy();
    expect(priceInput).toBeTruthy();
    expect(ratingInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it("displays currency comparison disclaimer", () => {
    render(<AddHotelPage />);

    expect(
      screen.getAllByText(/Please compare hotels within the same currency/)[0],
    ).toBeTruthy();
  });

  it("shows validation errors for empty fields", async () => {
    render(<AddHotelPage />);
    const { submitButton } = getFormElements();

    await userEvent.click(submitButton);

    expect(mockPush).not.toHaveBeenCalled();
    const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
    expect(savedHotels).toHaveLength(0);
  });

  it.each([
    {
      name: "Test Hotel",
      price: "-50",
      rating: "11",
      description: "negative price and high rating",
    },
    {
      name: "Valid Name",
      price: "abc",
      rating: "5",
      description: "non-numeric price",
    },
    {
      name: "Valid Name",
      price: "100",
      rating: "-1",
      description: "negative rating",
    },
  ])(
    "validates field values appropriately - $description",
    async ({ name, price, rating }) => {
      const user = userEvent.setup();
      render(<AddHotelPage />);
      const { submitButton } = getFormElements();

      await fillForm(user, { name, price, rating }, false);
      await user.click(submitButton);

      expect(mockPush).not.toHaveBeenCalled();
      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(0);
    },
  );

  describe("Successful Form Submissions", () => {
    it.each([
      {
        name: "Grand Hotel",
        price: "150",
        rating: "8.5",
        currency: "USD",
        expected: {
          name: "Grand Hotel",
          price: 150,
          rating: 8.5,
          currency: "USD",
        },
        description: "basic hotel with USD currency",
      },
      {
        name: "Budget Inn",
        price: "50.25",
        rating: "7",
        currency: "EUR",
        expected: {
          name: "Budget Inn",
          price: 50.25,
          rating: 7,
          currency: "EUR",
        },
        description: "budget hotel with decimal price",
      },
      {
        name: "Luxury Suite",
        price: "500",
        rating: "9.9",
        currency: "GBP",
        expected: {
          name: "Luxury Suite",
          price: 500,
          rating: 9.9,
          currency: "GBP",
        },
        description: "luxury hotel with high rating",
      },
    ])(
      "successfully submits form with $description",
      async ({ name, price, rating, currency, expected }) => {
        const user = userEvent.setup();
        render(<AddHotelPage />);
        const { submitButton } = getFormElements();

        await fillForm(user, { name, price, rating, currency });

        const { originalSetItem, getSavedData } = mockLocalStorageSetItem();
        await user.click(submitButton);
        await waitForFormUpdate();
        localStorage.setItem = originalSetItem;

        const savedHotels = getSavedData() ? JSON.parse(getSavedData()!) : [];
        expect(savedHotels).toHaveLength(1);
        expect(savedHotels[0]).toEqual(expected);
        expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
      },
    );

    it("adds hotel to existing hotels in localStorage", async () => {
      const user = userEvent.setup();

      const existingHotels = [
        { name: "Existing Hotel", price: 100, rating: 7, currency: "EUR" },
      ];
      localStorage.setItem("hotels", JSON.stringify(existingHotels));

      render(<AddHotelPage />);
      const { submitButton } = getFormElements();

      await fillForm(user, {
        name: "New Hotel",
        price: "200",
        rating: "9",
        currency: "EUR",
      });

      const { originalSetItem, getSavedData } = mockLocalStorageSetItem();
      await user.click(submitButton);
      await waitForFormUpdate();
      localStorage.setItem = originalSetItem;

      const savedHotels = getSavedData() ? JSON.parse(getSavedData()!) : [];
      expect(savedHotels).toHaveLength(2);
      expect(savedHotels[0]).toEqual(existingHotels[0]);
      expect(savedHotels[1]).toEqual({
        name: "New Hotel",
        price: 200,
        rating: 9,
        currency: "EUR",
      });
      expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
    });
  });

  it("has a working link to compare page", async () => {
    render(<AddHotelPage />);

    const comparePageLinks = screen.getAllByText(/View Compare Page/);
    expect(comparePageLinks.length).toBeGreaterThan(0);

    const link = comparePageLinks[0].closest("a");
    expect(link).not.toBeNull();
    if (link) {
      expect(link.getAttribute("href")).toBe("/hotels/compare");
    }
  });

  describe("Edge Cases", () => {
    it.each([
      {
        name: "Expensive Hotel",
        price: "999999999.99",
        rating: "10",
        expectedPrice: 999999999.99,
        description: "extremely large price values",
      },
      {
        name: "Budget Hotel",
        price: "0.01",
        rating: "5",
        expectedPrice: 0.01,
        description: "very small decimal prices",
      },
      {
        name: "Hôtel André & Co. (★★★★★) 日本語",
        price: "150",
        rating: "8.5",
        expectedPrice: 150,
        description: "special characters in hotel names",
      },
    ])(
      "handles $description",
      async ({ name, price, rating, expectedPrice }) => {
        const user = userEvent.setup();
        render(<AddHotelPage />);
        const { submitButton } = getFormElements();

        await fillForm(user, { name, price, rating });
        await user.click(submitButton);

        const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
        expect(savedHotels).toHaveLength(1);
        expect(savedHotels[0].name).toBe(name);
        expect(savedHotels[0].price).toBe(expectedPrice);
        expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
      },
    );

    it.each([
      { rating: "0.1", expected: 0.1, description: "minimum valid rating" },
      { rating: "10", expected: 10, description: "maximum valid rating" },
      { rating: "5.5", expected: 5.5, description: "mid-range decimal rating" },
    ])(
      "handles boundary rating value: $description",
      async ({ rating, expected }) => {
        const user = userEvent.setup();

        localStorage.clear();
        mockPush.mockClear();
        cleanup();
        render(<AddHotelPage />);

        const { submitButton } = getFormElements();
        await fillForm(user, { name: `Hotel ${rating}`, price: "100", rating });
        await user.click(submitButton);

        await waitForFormUpdate();

        const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
        expect(savedHotels).toHaveLength(1);
        expect(savedHotels[0].rating).toBe(expected);
        expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
      },
    );

    it("handles zero rating as edge case", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);
      const { submitButton } = getFormElements();

      await fillForm(user, {
        name: "Zero Rating Hotel",
        price: "100",
        rating: "0",
      });
      await user.click(submitButton);

      await waitForFormUpdate();

      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");

      if (savedHotels.length > 0) {
        expect(savedHotels[0].rating).toBe(0);
        expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
      } else {
        expect(mockPush).not.toHaveBeenCalled();
      }
    });

    it.each([
      { rating: "-1", description: "negative rating" },
      { rating: "11", description: "rating above 10" },
      { rating: "abc", description: "non-numeric rating" },
      { rating: "5.5.5", description: "malformed decimal" },
      { rating: "", description: "empty rating value" },
    ])("rejects invalid rating value: $description", async ({ rating }) => {
      const user = userEvent.setup();

      localStorage.clear();
      mockPush.mockClear();
      cleanup();
      render(<AddHotelPage />);

      const { submitButton } = getFormElements();

      if (rating === "") {
        await fillForm(user, { name: "Test Hotel", price: "100" });
        // Don't fill rating to test empty validation
      } else {
        await fillForm(user, { name: "Test Hotel", price: "100", rating });
      }

      await user.click(submitButton);
      await waitForFormUpdate();

      expect(mockPush).not.toHaveBeenCalled();
      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(0);
    });

    it("handles whitespace in inputs", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);
      const { submitButton } = getFormElements();

      await fillForm(user, {
        name: "  Trimmed Hotel  ",
        price: " 100.50 ",
        rating: " 8.5 ",
      });
      await user.click(submitButton);

      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(1);

      const savedHotel = savedHotels[0];
      expect(savedHotel.name).toMatch(/Trimmed Hotel/);
      expect(savedHotel.price).toBe(100.5);
      expect(savedHotel.rating).toBe(8.5);
      expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
    });

    it.each([
      { missingField: "name", description: "missing hotel name" },
      { missingField: "price", description: "empty price field" },
    ])(
      "rejects missing required fields: $description",
      async ({ missingField }) => {
        const user = userEvent.setup();
        render(<AddHotelPage />);
        const { submitButton } = getFormElements();

        const formData: { name?: string; price?: string; rating?: string } = {
          name: "Test Hotel",
          price: "100",
          rating: "8",
        };

        delete formData[missingField as keyof typeof formData];

        if (missingField !== "name") await fillForm(user, formData);
        if (missingField !== "price") await fillForm(user, formData);

        await user.click(submitButton);
        await waitForFormUpdate();

        expect(mockPush).not.toHaveBeenCalled();
        const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
        expect(savedHotels).toHaveLength(0);
      },
    );

    it("demonstrates parseFloat behavior with malformed decimals", () => {
      expect(parseFloat("1.2.3")).toBe(1.2);
      expect(parseFloat("abc")).toBeNaN();
      expect(parseFloat("-50")).toBe(-50);
      expect(parseFloat("")).toBeNaN();
    });

    it("handles zero price as edge case", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);
      const { submitButton } = getFormElements();

      await fillForm(user, { name: "Free Hotel", price: "0", rating: "8" });
      await user.click(submitButton);

      await waitForFormUpdate();

      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");

      if (savedHotels.length > 0) {
        expect(savedHotels[0].price).toBe(0);
        expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
      } else {
        expect(mockPush).not.toHaveBeenCalled();
      }
    });

    it("handles extremely long hotel names", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);
      const { submitButton } = getFormElements();

      const longName = "A".repeat(50);
      await fillForm(user, { name: longName, price: "100", rating: "8" });
      await user.click(submitButton);

      await waitForFormUpdate();

      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(1);
      expect(savedHotels[0].name).toBe(longName);
      expect(savedHotels[0].price).toBe(100);
      expect(savedHotels[0].rating).toBe(8);
      expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
    }, 10000);
  });

  it("clears field-level error when user types in a field with an existing error (line 118 branch)", async () => {
    const user = userEvent.setup();
    render(<AddHotelPage />);
    const { nameInput, priceInput, ratingInput, submitButton } =
      getFormElements();

    // Step 1: Submit with empty fields to trigger validation errors
    await user.click(submitButton);

    // Step 2: Verify error state is shown (form has errors)
    // The validation errors should be visible now
    expect(mockPush).not.toHaveBeenCalled();

    // Step 3: Type in the name field which has an error - this should trigger
    // the `if (errors[name as keyof typeof errors])` branch to clear errors
    await user.type(nameInput, "H");

    // Step 4: Type in price field (also has an error)
    await user.type(priceInput, "1");

    // Step 5: Type in rating field (also has an error)
    await user.type(ratingInput, "5");

    // The errors should be cleared as the user types, allowing eventual submission
    await fillForm(
      user,
      { name: "otel Test", price: "00", rating: ".0" },
      false,
    );
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
    });
  });

  describe("Error Handling", () => {
    it.each([
      {
        mockType: "setItem",
        errorMessage: "localStorage quota exceeded",
        description: "localStorage.setItem throws an error",
      },
      {
        mockType: "getItem",
        errorMessage: "Storage read failed",
        description: "localStorage.getItem fails during initialization",
      },
    ])(
      "should display error message when $description",
      async ({ mockType, errorMessage }) => {
        const user = userEvent.setup();
        const originalMethod =
          localStorage[mockType as keyof typeof localStorage];

        if (mockType === "setItem") {
          localStorage.setItem = vi.fn(() => {
            throw new Error(errorMessage);
          });
        } else {
          localStorage.getItem = vi.fn(() => {
            throw new Error(errorMessage);
          });
        }

        render(<AddHotelPage />);
        const { submitButton } = getFormElements();

        await fillForm(user, { name: "Test Hotel", price: "100", rating: "8" });
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText(/Unable to save hotel data/i)).toBeTruthy();
        });

        expect(mockPush).not.toHaveBeenCalled();
        localStorage[mockType as keyof typeof localStorage] = originalMethod;
      },
    );

    it("should preserve existing form data when localStorage fails", async () => {
      const user = userEvent.setup();
      const originalSetItem = localStorage.setItem;

      localStorage.setItem = vi.fn(() => {
        throw new Error("Storage failed");
      });

      render(<AddHotelPage />);
      const { nameInput, priceInput, ratingInput, submitButton } =
        getFormElements();

      const formData = { name: "Test Hotel", price: "100", rating: "8" };
      await fillForm(user, formData);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Unable to save hotel data/i)).toBeTruthy();
      });

      expect((nameInput as HTMLInputElement).value).toBe(formData.name);
      expect((priceInput as HTMLInputElement).value).toBe(formData.price);
      expect((ratingInput as HTMLInputElement).value).toBe(formData.rating);

      localStorage.setItem = originalSetItem;
    });

    it("should handle localStorage unavailability error specifically", async () => {
      const user = userEvent.setup();
      const originalLocalStorage = window.localStorage;

      // Mock localStorage methods to throw "not available" errors
      const mockStorage = {
        getItem: vi.fn(() => {
          throw new Error("localStorage is not available");
        }),
        setItem: vi.fn(() => {
          throw new Error("localStorage is not available");
        }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };

      Object.defineProperty(window, "localStorage", {
        value: mockStorage,
        writable: true,
        configurable: true,
      });

      render(<AddHotelPage />);
      const { submitButton } = getFormElements();

      await fillForm(user, { name: "Test Hotel", price: "100", rating: "8" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Unable to save hotel data/i)).toBeTruthy();
      });

      expect(mockPush).not.toHaveBeenCalled();
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
        writable: true,
        configurable: true,
      });
    });
  });
});
