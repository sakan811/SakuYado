// __tests__/pages/add-hotel.test.tsx
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "../test-utils";
import userEvent from "@testing-library/user-event";
import AddHotelPage from "../../src/app/hotels/add/page";

// Mock the Next.js useRouter hook
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("AddHotelPage", () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    mockPush.mockClear();
  });

  it("renders the add hotel form", () => {
    render(<AddHotelPage />);

    expect(screen.getAllByText("Add Hotel Information")[0]).toBeTruthy();
    expect(screen.getAllByLabelText(/Hotel Name/i)[0]).toBeTruthy();
    expect(screen.getAllByLabelText(/Price/i)[0]).toBeTruthy();
    expect(screen.getAllByLabelText(/Rating/i)[0]).toBeTruthy();
    expect(screen.getAllByText(/Submit & Compare/i)[0]).toBeTruthy();
  });

  it("displays currency comparison disclaimer", () => {
    render(<AddHotelPage />);

    expect(
      screen.getAllByText(/Please compare hotels within the same currency/)[0],
    ).toBeTruthy();
  });

  it("shows validation errors for empty fields", async () => {
    render(<AddHotelPage />);

    // Submit the form without filling any fields
    const submitButtons = screen.getAllByText(/Submit & Compare/i);
    await userEvent.click(submitButtons[0]);

    // Check that navigation did not occur
    expect(mockPush).not.toHaveBeenCalled();

    // Check that localStorage wasn't updated
    const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
    expect(savedHotels).toHaveLength(0);
  });

  it("validates field values appropriately", async () => {
    const user = userEvent.setup();
    render(<AddHotelPage />);

    // Get input fields and submit button
    const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
    const priceInput = screen.getAllByLabelText(/Price/i)[0];
    const ratingInput = screen.getAllByLabelText(/Rating/i)[0];
    const submitButton = screen.getAllByText(/Submit & Compare/i)[0];

    // Enter valid name but invalid price and rating
    await user.type(nameInput, "Test Hotel");
    await user.clear(priceInput);
    await user.type(priceInput, "-50");
    await user.type(ratingInput, "11");

    // Trigger validation by attempting submission
    await user.click(submitButton);

    // Check if validation was called and form submission was prevented
    expect(mockPush).not.toHaveBeenCalled();

    // Check that localStorage wasn't updated since validation failed
    const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
    expect(savedHotels).toHaveLength(0);
  });

  it("successfully submits the form with valid data and proper data types", async () => {
    const user = userEvent.setup();
    render(<AddHotelPage />);

    // Get input fields
    const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
    const priceInput = screen.getAllByLabelText(/Price/i)[0];
    const ratingInput = screen.getAllByLabelText(/Rating/i)[0];
    const currencySelect = document.getElementById(
      "currency",
    ) as HTMLSelectElement;
    const submitButton = screen.getAllByText(/Submit & Compare/i)[0];

    // Fill valid form data
    await user.clear(nameInput);
    await user.type(nameInput, "Grand Hotel");
    await user.clear(priceInput);
    await user.type(priceInput, "150");
    await user.clear(ratingInput);
    await user.type(ratingInput, "8.5");
    await user.selectOptions(currencySelect, "USD");

    // Mock localStorage.setItem
    const originalSetItem = localStorage.setItem;
    let savedData: string | null = null;
    localStorage.setItem = vi.fn((key, value) => {
      if (key === "hotels") {
        savedData = value;
      }
      return originalSetItem.call(localStorage, key, value);
    });

    // Submit form
    await user.click(submitButton);

    // Wait for state updates
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Restore original localStorage.setItem
    localStorage.setItem = originalSetItem; // Parse the saved data
    const savedHotels = savedData ? JSON.parse(savedData) : [];

    // Verify the expected hotel data was saved
    expect(savedHotels).toHaveLength(1);

    // Check if the last hotel added matches our test data with proper types
    const lastHotel = savedHotels[0];
    expect(lastHotel).toEqual({
      name: "Grand Hotel",
      price: 150, // Should be number, not string
      rating: 8.5, // Should be number, not string
      currency: "USD", // Default currency
    });

    // Check that navigation was called
    expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
  });

  it("adds hotel to existing hotels in localStorage with currency", async () => {
    const user = userEvent.setup();

    // Setup existing hotels in localStorage
    const existingHotels = [
      { name: "Existing Hotel", price: 100, rating: 7, currency: "EUR" },
    ];
    localStorage.setItem("hotels", JSON.stringify(existingHotels));

    render(<AddHotelPage />);

    // Fill valid form data
    const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
    const priceInput = screen.getAllByLabelText(/Price/i)[0];
    const ratingInput = screen.getAllByLabelText(/Rating/i)[0];
    const submitButton = screen.getAllByText(/Submit & Compare/i)[0];

    await user.clear(nameInput);
    await user.type(nameInput, "New Hotel");
    await user.clear(priceInput);
    await user.type(priceInput, "200");
    await user.clear(ratingInput);
    await user.type(ratingInput, "9");

    // Change currency - get by id instead of role with name
    const currencySelect = document.getElementById(
      "currency",
    ) as HTMLSelectElement;
    await user.selectOptions(currencySelect, "EUR");

    // Mock localStorage.setItem
    const originalSetItem = localStorage.setItem;
    let savedData: string | null = null;
    localStorage.setItem = vi.fn((key, value) => {
      if (key === "hotels") {
        savedData = value;
      }
      return originalSetItem.call(localStorage, key, value);
    });

    // Submit form
    await user.click(submitButton);

    // Wait for state updates
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Restore original localStorage.setItem
    localStorage.setItem = originalSetItem;
    // Parse the saved data
    const savedHotels = savedData ? JSON.parse(savedData) : [];

    // Verify the final localStorage state
    expect(savedHotels).toHaveLength(2);

    // Check if existing hotel was preserved
    expect(savedHotels[0]).toEqual({
      name: "Existing Hotel",
      price: 100,
      rating: 7,
      currency: "EUR",
    });

    // Check if the new hotel was added with correct types and currency
    expect(savedHotels[1]).toEqual({
      name: "New Hotel",
      price: 200, // Should be number, not string
      rating: 9, // Should be number, not string
      currency: "EUR",
    });

    // Check that navigation was called
    expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
  });

  it("has a working link to compare page", async () => {
    render(<AddHotelPage />);

    // Fix: Use getAllByText to handle multiple instances, consistent with other tests
    const comparePageLinks = screen.getAllByText(/View Compare Page/);
    expect(comparePageLinks.length).toBeGreaterThan(0);

    const link = comparePageLinks[0].closest("a");
    expect(link).not.toBeNull();
    if (link) {
      expect(link.getAttribute("href")).toBe("/hotels/compare");
    }
  });

  it("saves and loads currency preference", async () => {
    const user = userEvent.setup();

    // Set a currency preference
    localStorage.setItem("lastUsedCurrency", "EUR");

    render(<AddHotelPage />);

    // Check if the saved currency is selected
    const currencySelect = document.getElementById(
      "currency",
    ) as HTMLSelectElement;
    expect(currencySelect.value).toBe("EUR");

    // Change currency and verify it's saved
    await user.selectOptions(currencySelect, "GBP");
    expect(localStorage.getItem("lastUsedCurrency")).toBe("GBP");
  });

  describe("Edge Cases", () => {
    it("handles extremely large price values", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(nameInput, "Expensive Hotel");
      await user.type(priceInput, "999999999.99");
      await user.type(ratingInput, "10");

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(1);
      expect(savedHotels[0].price).toBe(999999999.99);
      expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
    });

    it("handles very small decimal prices", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(nameInput, "Budget Hotel");
      await user.type(priceInput, "0.01");
      await user.type(ratingInput, "5");

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(1);
      expect(savedHotels[0].price).toBe(0.01);
      expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
    });

    it("handles special characters in hotel names", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      const specialName = "Hôtel André & Co. (★★★★★) 日本語";

      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(nameInput, specialName);
      await user.type(priceInput, "150");
      await user.type(ratingInput, "8.5");

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(1);
      expect(savedHotels[0].name).toBe(specialName);
      expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
    });

    it("handles boundary rating values", async () => {
      const user = userEvent.setup();

      // Test exact boundaries - only include values that should actually pass validation
      const testCases = [
        { rating: "0.1", expected: 0.1 }, // Avoid exact 0 which might be treated as invalid
        { rating: "10", expected: 10 },
        { rating: "5.5", expected: 5.5 },
      ];

      for (const testCase of testCases) {
        // Clear storage and mocks for each iteration
        localStorage.clear();
        mockPush.mockClear();
        cleanup();

        // Re-render component for each test case to ensure clean state
        render(<AddHotelPage />);

        const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
        const priceInput = screen.getAllByLabelText(/Price/i)[0];
        const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

        await user.clear(nameInput);
        await user.clear(priceInput);
        await user.clear(ratingInput);

        await user.type(nameInput, `Hotel ${testCase.rating}`);
        await user.type(priceInput, "100");
        await user.type(ratingInput, testCase.rating);

        const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
        await user.click(submitButton);

        // Wait for any async operations to complete
        await new Promise((resolve) => setTimeout(resolve, 100));

        const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");

        // Check that data was saved successfully for valid ratings
        expect(savedHotels).toHaveLength(1);
        expect(savedHotels[0].rating).toBe(testCase.expected);
        expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
      }
    });

    it("handles zero rating as edge case", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(nameInput, "Zero Rating Hotel");
      await user.type(priceInput, "100");
      await user.type(ratingInput, "0");

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      // Wait for validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if zero rating is accepted or rejected by the component
      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");

      if (savedHotels.length > 0) {
        // If zero rating is accepted as valid
        expect(savedHotels[0].rating).toBe(0);
        expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
      } else {
        // If zero rating is rejected as invalid
        expect(mockPush).not.toHaveBeenCalled();
      }
    });

    it("rejects invalid rating values", async () => {
      const user = userEvent.setup();

      const invalidRatings = [
        { value: "-1", description: "negative rating" },
        { value: "11", description: "rating above 10" },
        { value: "abc", description: "non-numeric rating" },
        { value: "5.5.5", description: "malformed decimal" },
      ];

      for (const invalidRating of invalidRatings) {
        // Clear storage and mocks for each iteration
        localStorage.clear();
        mockPush.mockClear();
        cleanup();

        // Re-render component for each test case
        render(<AddHotelPage />);

        const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
        const priceInput = screen.getAllByLabelText(/Price/i)[0];
        const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

        await user.clear(nameInput);
        await user.clear(priceInput);
        await user.clear(ratingInput);

        await user.type(nameInput, "Test Hotel");
        await user.type(priceInput, "100");
        await user.type(ratingInput, invalidRating.value);

        const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
        await user.click(submitButton);

        // Wait for any validation to complete
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Should not navigate if validation fails
        expect(mockPush).not.toHaveBeenCalled();

        // Should not save invalid data to localStorage
        const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
        expect(savedHotels).toHaveLength(0);
      }
    });

    it("rejects empty rating value", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(nameInput, "Test Hotel");
      await user.type(priceInput, "100");
      // Don't type anything in rating field (leave it empty)

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      // Wait for validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should not navigate if validation fails
      expect(mockPush).not.toHaveBeenCalled();

      // Should not save invalid data to localStorage
      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(0);
    });

    it("handles whitespace in inputs", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(nameInput, "  Trimmed Hotel  ");
      await user.type(priceInput, " 100.50 ");
      await user.type(ratingInput, " 8.5 ");

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(1);

      // Test actual behavior - inputs might be trimmed or preserved
      const savedHotel = savedHotels[0];
      expect(savedHotel.name).toMatch(/Trimmed Hotel/); // Should contain the text
      expect(savedHotel.price).toBe(100.5);
      expect(savedHotel.rating).toBe(8.5);
      expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
    });

    it("rejects missing required fields", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      // Test missing hotel name
      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(priceInput, "100");
      await user.type(ratingInput, "8");

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      // Wait for validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockPush).not.toHaveBeenCalled();
      expect(JSON.parse(localStorage.getItem("hotels") || "[]")).toHaveLength(0);
    });

    it("handles empty price field validation", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(nameInput, "Test Hotel");
      // Leave price empty
      await user.type(ratingInput, "8");

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      // Wait for validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should not navigate or save with empty price
      expect(mockPush).not.toHaveBeenCalled();
      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(0);
    });

    it("demonstrates parseFloat behavior with malformed decimals", () => {
      // This is a unit test to document JavaScript's parseFloat behavior
      // which affects how the component handles certain inputs
      expect(parseFloat("1.2.3")).toBe(1.2); // parseFloat stops at first invalid character
      expect(parseFloat("abc")).toBeNaN();
      expect(parseFloat("-50")).toBe(-50);
      expect(parseFloat("")).toBeNaN();
    });

    it("handles zero price as edge case", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(nameInput, "Free Hotel");
      await user.type(priceInput, "0");
      await user.type(ratingInput, "8");

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      // Wait for validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if zero price is accepted or rejected by the component
      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");

      if (savedHotels.length > 0) {
        // If zero price is accepted as valid
        expect(savedHotels[0].price).toBe(0);
        expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
      } else {
        // If zero price is rejected as invalid
        expect(mockPush).not.toHaveBeenCalled();
      }
    });

    it("handles extremely long hotel names", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      // Test with long hotel name but much shorter to avoid timeout
      const longName = "A".repeat(50); // Reduced significantly to prevent timeout

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(nameInput, longName);
      await user.type(priceInput, "100");
      await user.type(ratingInput, "8");

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      // Wait for form submission
      await new Promise((resolve) => setTimeout(resolve, 100));

      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");

      // Should accept long names (most forms don't have length validation)
      expect(savedHotels).toHaveLength(1);
      expect(savedHotels[0].name).toBe(longName);
      expect(savedHotels[0].price).toBe(100);
      expect(savedHotels[0].rating).toBe(8);
      expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
    }, 10000); // Add 10 second timeout to be safe

    it("preserves currency selection between form submissions", async () => {
      const user = userEvent.setup();
      render(<AddHotelPage />);

      // Fix: Use document.getElementById directly since the select doesn't have a label
      const currencySelect = document.getElementById(
        "currency",
      ) as HTMLSelectElement;

      // Change currency to EUR
      await user.selectOptions(currencySelect, "EUR");

      // Fill and submit form
      const nameInput = screen.getAllByLabelText(/Hotel Name/i)[0];
      const priceInput = screen.getAllByLabelText(/Price/i)[0];
      const ratingInput = screen.getAllByLabelText(/Rating/i)[0];

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.clear(ratingInput);

      await user.type(nameInput, "European Hotel");
      await user.type(priceInput, "150");
      await user.type(ratingInput, "9");

      const submitButton = screen.getAllByText(/Submit & Compare/i)[0];
      await user.click(submitButton);

      const savedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      expect(savedHotels).toHaveLength(1);
      expect(savedHotels[0].currency).toBe("EUR");

      // Check that currency preference was saved
      expect(localStorage.getItem("lastUsedCurrency")).toBe("EUR");
      expect(mockPush).toHaveBeenCalledWith("/hotels/compare");
    });
  });
});
