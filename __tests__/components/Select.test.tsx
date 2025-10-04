/*
 * SakuYado - A web application that helps you find the best value accommodations
 * Copyright (C) 2025  Sakan Nirattisaykul
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "@/components/ui/Select";

describe("Select", () => {
  const defaultOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  afterEach(() => {
    cleanup();
  });

  it("renders select element with options", () => {
    render(<Select options={defaultOptions} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Option 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Option 2" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Option 3" }),
    ).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Select options={defaultOptions} label="Test Label" />);

    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
  });

  it("renders label with icon when provided", () => {
    render(
      <Select
        options={defaultOptions}
        label="Test Label with Icon"
        icon="🏨"
      />,
    );

    const icon = screen.getByText("🏨");
    const label = screen.getByText("Test Label with Icon");

    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label.parentElement).toContainElement(icon);
  });

  it("associates label with select element using htmlFor", () => {
    render(
      <Select options={defaultOptions} label="Test Label" id="test-select" />,
    );

    const label = screen.getByText("Test Label");
    const select = screen.getByRole("combobox");

    expect(label).toHaveAttribute("for", "test-select");
    expect(select).toHaveAttribute("id", "test-select");
  });

  it("applies error styles when error prop is provided", () => {
    render(<Select options={defaultOptions} error="This field is required" />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass(
      "border-red-300",
      "focus:border-red-400",
      "focus:ring-red-400",
    );
  });

  it("displays error message when error prop is provided", () => {
    render(<Select options={defaultOptions} error="This field is required" />);

    const errorMessage = screen.getByText("This field is required");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });

  it("does not display error message when error prop is not provided", () => {
    render(<Select options={defaultOptions} />);

    const errorMessage = screen.queryByText(/required/i);
    expect(errorMessage).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Select options={defaultOptions} className="custom-class" />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("custom-class");
  });

  it("handles select change events", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Select options={defaultOptions} onChange={handleChange} />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "option2");

    expect(handleChange).toHaveBeenCalledOnce();
  });

  it("supports disabled state", () => {
    render(<Select options={defaultOptions} disabled />);

    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
  });

  it("renders without label when label prop is not provided", () => {
    render(<Select options={defaultOptions} />);

    const label = screen.queryByRole("label");
    expect(label).not.toBeInTheDocument();
  });

  it("combines base classes with error classes correctly", () => {
    render(
      <Select
        options={defaultOptions}
        error="Error message"
        className="additional-class"
      />,
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass(
      "w-full",
      "px-2",
      "py-2",
      "border-2",
      "border-pink-200",
    );
    expect(select).toHaveClass(
      "border-red-300",
      "focus:border-red-400",
      "focus:ring-red-400",
    );
    expect(select).toHaveClass("additional-class");
  });
});
