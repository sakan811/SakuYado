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

import { describe, it, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { DataTable } from "@/app/hotels/compare/data-table";
import { type ColumnDef } from "@tanstack/react-table";

type TestRow = {
    name: string;
    price: number;
};

const basicColumns: ColumnDef<TestRow>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }) => String(getValue()),
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => `$${getValue()}`,
    },
];

const basicData: TestRow[] = [
    { name: "Hotel A", price: 100 },
    { name: "Hotel B", price: 200 },
];

describe("DataTable component", () => {
    it("renders table with data rows", () => {
        render(<DataTable columns={basicColumns} data={basicData} />);

        expect(screen.getByText("Name")).toBeTruthy();
        expect(screen.getByText("Price")).toBeTruthy();
        expect(screen.getByText("Hotel A")).toBeTruthy();
        expect(screen.getByText("Hotel B")).toBeTruthy();

        cleanup();
    });

    it("renders 'No results.' when data is empty (empty rows branch)", () => {
        render(<DataTable columns={basicColumns} data={[]} />);

        expect(screen.getByText("No results.")).toBeTruthy();
        cleanup();
    });

    it("renders correct number of data rows", () => {
        render(<DataTable columns={basicColumns} data={basicData} />);

        const rows = screen.getAllByRole("row");
        // 1 header row + 2 data rows
        expect(rows.length).toBe(3);
        cleanup();
    });

    it("renders table header correctly", () => {
        render(<DataTable columns={basicColumns} data={basicData} />);

        const headerRow = screen.getAllByRole("row")[0];
        expect(headerRow.textContent).toContain("Name");
        expect(headerRow.textContent).toContain("Price");
        cleanup();
    });

    it("renders with asymmetric column depths to trigger isPlaceholder=true branch (line 50)", () => {
        // Asymmetric column groups: one column is grouped (depth=2), one is not (depth=1)
        // This causes the non-grouped column to have a placeholder in the first header row
        type ExtendedRow = { name: string; price: number; rating: number };

        const asymmetricColumns: ColumnDef<ExtendedRow>[] = [
            // This flat column will have isPlaceholder=true in the first header row
            {
                accessorKey: "rating",
                header: "Rating",
            },
            // This grouped column occupies 2 header rows
            {
                id: "hotel-group",
                header: "Hotel Info",
                columns: [
                    { accessorKey: "name", header: "Name" },
                    { accessorKey: "price", header: "Price" },
                ],
            },
        ];

        const data: ExtendedRow[] = [
            { name: "Hotel A", price: 100, rating: 8 },
        ];

        render(<DataTable columns={asymmetricColumns} data={data} />);

        // Both header levels and data rows should be present
        expect(screen.getByText("Hotel Info")).toBeTruthy();
        expect(screen.getByText("Name")).toBeTruthy();
        expect(screen.getByText("Price")).toBeTruthy();
        expect(screen.getByText("Rating")).toBeTruthy();
        expect(screen.getByText("Hotel A")).toBeTruthy();

        cleanup();
    });


    it("renders with group columns to trigger placeholder header branch (isPlaceholder=true)", () => {
        // Column groups cause header.isPlaceholder = true for the group spanning cells
        const groupedColumns: ColumnDef<TestRow>[] = [
            {
                id: "hotel-group",
                header: "Hotel Info",
                columns: [
                    {
                        accessorKey: "name",
                        header: "Name",
                    },
                    {
                        accessorKey: "price",
                        header: "Price",
                    },
                ],
            },
        ];

        render(<DataTable columns={groupedColumns} data={basicData} />);

        // "Hotel Info" is the group header
        expect(screen.getByText("Hotel Info")).toBeTruthy();
        // Sub-column headers
        expect(screen.getByText("Name")).toBeTruthy();
        expect(screen.getByText("Price")).toBeTruthy();
        // Data rows
        expect(screen.getByText("Hotel A")).toBeTruthy();

        cleanup();
    });

    it("renders single row correctly", () => {
        const singleRow: TestRow[] = [{ name: "Solo Hotel", price: 999 }];
        render(<DataTable columns={basicColumns} data={singleRow} />);

        expect(screen.getByText("Solo Hotel")).toBeTruthy();
        expect(screen.queryByText("No results.")).toBeNull();
        cleanup();
    });

    it("renders cell values through flexRender", () => {
        const columnsWithFormatter: ColumnDef<TestRow>[] = [
            {
                accessorKey: "name",
                header: "Hotel Name",
                cell: ({ getValue }) => `🏨 ${String(getValue())}`,
            },
        ];

        render(
            <DataTable
                columns={columnsWithFormatter}
                data={[{ name: "Grand Hotel", price: 200 }]}
            />,
        );

        expect(screen.getByText("🏨 Grand Hotel")).toBeTruthy();
        cleanup();
    });

    it("applies alternating row background classes", () => {
        const threeHotels: TestRow[] = [
            { name: "Hotel 1", price: 100 },
            { name: "Hotel 2", price: 200 },
            { name: "Hotel 3", price: 300 },
        ];

        render(<DataTable columns={basicColumns} data={threeHotels} />);

        // All three hotels should be present in the table
        expect(screen.getByText("Hotel 1")).toBeTruthy();
        expect(screen.getByText("Hotel 2")).toBeTruthy();
        expect(screen.getByText("Hotel 3")).toBeTruthy();

        // Should have header + 3 data rows
        const rows = screen.getAllByRole("row");
        expect(rows.length).toBe(4);

        cleanup();
    });
});
