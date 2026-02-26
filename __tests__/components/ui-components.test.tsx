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

// Test barrel imports (covers components/index.ts and components/ui/index.ts)
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  Alert,
  AlertTitle,
  AlertDescription,
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
  FieldLegend,
  FieldContent,
  FieldTitle,
  FieldDescription,
  FieldSeparator,
  Label,
  Separator,
} from "@/components";

// Import Table components directly to ensure table.tsx is exercised
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

// ─────────────────────────────────────────────────────────────
// Separator
// ─────────────────────────────────────────────────────────────
describe("Separator component", () => {
  it("renders with default horizontal orientation", () => {
    const { container } = render(<Separator />);
    const sep = container.firstChild as HTMLElement;
    expect(sep).toBeTruthy();
    expect(sep.getAttribute("data-slot")).toBe("separator");
    expect(sep.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("renders with vertical orientation", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const sep = container.firstChild as HTMLElement;
    expect(sep.getAttribute("data-orientation")).toBe("vertical");
  });

  it("renders with custom className", () => {
    const { container } = render(<Separator className="custom-class" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders as non-decorative when decorative=false", () => {
    const { container } = render(
      <Separator decorative={false} aria-label="Section divider" />,
    );
    const sep = container.firstChild as HTMLElement;
    expect(sep).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────
// Label
// ─────────────────────────────────────────────────────────────
describe("Label component", () => {
  it("renders label text", () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText("Test Label")).toBeTruthy();
    cleanup();
  });

  it("renders with htmlFor attribute", () => {
    render(<Label htmlFor="test-input">My Label</Label>);
    const label = screen.getByText("My Label");
    expect(label.getAttribute("for")).toBe("test-input");
    cleanup();
  });
});

// ─────────────────────────────────────────────────────────────
// Alert & AlertTitle
// ─────────────────────────────────────────────────────────────
describe("Alert components", () => {
  it("renders Alert with default variant", () => {
    const { container } = render(
      <Alert>
        <AlertDescription>Default alert</AlertDescription>
      </Alert>,
    );
    const alert = container.querySelector('[data-slot="alert"]') as HTMLElement;
    expect(alert).toBeTruthy();
    cleanup();
  });

  it("renders Alert with destructive variant", () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertDescription>Error message</AlertDescription>
      </Alert>,
    );
    const alert = container.querySelector('[data-slot="alert"]') as HTMLElement;
    expect(alert).toBeTruthy();
    cleanup();
  });

  it("renders AlertTitle (previously uncovered - line 38)", () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description text</AlertDescription>
      </Alert>,
    );
    expect(screen.getByText("Alert Title")).toBeTruthy();
    const titleEl = screen.getByText("Alert Title");
    expect(titleEl.getAttribute("data-slot")).toBe("alert-title");
    cleanup();
  });

  it("renders AlertTitle with custom className", () => {
    render(
      <Alert>
        <AlertTitle className="custom-title">Custom Title</AlertTitle>
      </Alert>,
    );
    expect(screen.getByText("Custom Title")).toBeTruthy();
    cleanup();
  });
});

// ─────────────────────────────────────────────────────────────
// Card components
// ─────────────────────────────────────────────────────────────
describe("Card components", () => {
  it("renders Card with default variant", () => {
    const { container } = render(<Card>Card content</Card>);
    const card = container.querySelector('[data-slot="card"]') as HTMLElement;
    expect(card).toBeTruthy();
    cleanup();
  });

  it("renders Card with gradient variant", () => {
    const { container } = render(<Card variant="gradient">Gradient</Card>);
    const card = container.querySelector('[data-slot="card"]') as HTMLElement;
    expect(card).toBeTruthy();
    cleanup();
  });

  it("renders Card with highlight variant", () => {
    const { container } = render(<Card variant="highlight">Highlight</Card>);
    expect(container.querySelector('[data-slot="card"]')).toBeTruthy();
    cleanup();
  });

  it("renders Card with size sm", () => {
    const { container } = render(<Card size="sm">Small</Card>);
    expect(container.querySelector('[data-slot="card"]')).toBeTruthy();
    cleanup();
  });

  it("renders Card with size lg", () => {
    const { container } = render(<Card size="lg">Large</Card>);
    expect(container.querySelector('[data-slot="card"]')).toBeTruthy();
    cleanup();
  });

  it("renders CardAction (previously uncovered - line 72)", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction data-testid="card-action">Action Button</CardAction>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByText("Action Button")).toBeTruthy();
    const action = screen.getByText("Action Button");
    expect(action.getAttribute("data-slot")).toBe("card-action");
    cleanup();
  });

  it("renders all Card sub-components together", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>My Hotel</CardTitle>
          <CardDescription>A nice place to stay</CardDescription>
          <CardAction>Edit</CardAction>
        </CardHeader>
        <CardContent>Price: $100</CardContent>
        <CardFooter>Footer text</CardFooter>
      </Card>,
    );
    expect(screen.getByText("My Hotel")).toBeTruthy();
    expect(screen.getByText("A nice place to stay")).toBeTruthy();
    expect(screen.getByText("Edit")).toBeTruthy();
    expect(screen.getByText("Price: $100")).toBeTruthy();
    expect(screen.getByText("Footer text")).toBeTruthy();
    cleanup();
  });
});

// ─────────────────────────────────────────────────────────────
// Table components (using actual UI components from table.tsx)
// ─────────────────────────────────────────────────────────────
describe("Table components", () => {
  it("renders basic Table with header and body", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Hotel A</TableCell>
            <TableCell>$100</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Hotel A")).toBeTruthy();
    cleanup();
  });

  it("renders TableFooter (previously uncovered - line 43)", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    expect(screen.getByText("Footer Total")).toBeTruthy();
    const footer = document.querySelector('[data-slot="table-footer"]');
    expect(footer).toBeTruthy();
    cleanup();
  });

  it("renders TableCaption (previously uncovered - line 98)", () => {
    render(
      <Table>
        <TableCaption>Hotel Comparison Results</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText("Hotel Comparison Results")).toBeTruthy();
    const caption = document.querySelector('[data-slot="table-caption"]');
    expect(caption).toBeTruthy();
    cleanup();
  });

  it("renders complete Table with all sub-components", () => {
    render(
      <Table>
        <TableCaption>Hotels</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Hotel A</TableCell>
            <TableCell>$100</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total: 1 hotel</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    expect(screen.getByText("Hotels")).toBeTruthy();
    expect(screen.getByText("Hotel A")).toBeTruthy();
    expect(screen.getByText("Total: 1 hotel")).toBeTruthy();
    const caption = document.querySelector('[data-slot="table-caption"]');
    const footer = document.querySelector('[data-slot="table-footer"]');
    expect(caption).toBeTruthy();
    expect(footer).toBeTruthy();
    cleanup();
  });

  it("renders TableCaption with custom className", () => {
    render(
      <Table>
        <TableCaption className="custom-caption">Custom Caption</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Item</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText("Custom Caption")).toBeTruthy();
    cleanup();
  });

  it("renders TableFooter with custom className", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Body</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className="custom-footer">
          <TableRow>
            <TableCell>Custom Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    expect(screen.getByText("Custom Footer")).toBeTruthy();
    cleanup();
  });
});

// ─────────────────────────────────────────────────────────────
// Select components (uncovered: SelectGroup, SelectLabel, SelectSeparator, popper position)
// ─────────────────────────────────────────────────────────────
describe("Select components (additional coverage)", () => {
  it("renders SelectGroup, SelectLabel, SelectSeparator (previously uncovered)", () => {
    // We render a Select tree but don't open the dropdown since that requires user interaction
    const { container } = render(
      <Select defaultValue="usd">
        <SelectTrigger>
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Major Currencies</SelectLabel>
            <SelectItem value="usd">USD</SelectItem>
            <SelectItem value="eur">EUR</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Other</SelectLabel>
            <SelectItem value="jpy">JPY</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );
    // The trigger element should be present
    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toBeTruthy();
    cleanup();
  });

  it("renders Select with position=popper (covers lines 65-77 branch)", () => {
    const { container } = render(
      <Select defaultValue="a">
        <SelectTrigger>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(
      container.querySelector('[data-slot="select-trigger"]'),
    ).toBeTruthy();
    cleanup();
  });

  it("renders Select with default item-aligned position", () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(
      container.querySelector('[data-slot="select-trigger"]'),
    ).toBeTruthy();
    cleanup();
  });
});

// ─────────────────────────────────────────────────────────────
// Field components (heavily uncovered)
// ─────────────────────────────────────────────────────────────
describe("Field components", () => {
  it("renders FieldSet", () => {
    const { container } = render(
      <FieldSet>
        <legend>My Fieldset</legend>
      </FieldSet>,
    );
    const fieldset = container.querySelector('[data-slot="field-set"]');
    expect(fieldset).toBeTruthy();
    cleanup();
  });

  it("renders FieldLegend with default legend variant", () => {
    const { container } = render(
      <fieldset>
        <FieldLegend>Legend Text</FieldLegend>
      </fieldset>,
    );
    const legend = container.querySelector('[data-slot="field-legend"]');
    expect(legend).toBeTruthy();
    expect(legend?.getAttribute("data-variant")).toBe("legend");
    cleanup();
  });

  it("renders FieldLegend with label variant", () => {
    const { container } = render(
      <fieldset>
        <FieldLegend variant="label">Label Legend</FieldLegend>
      </fieldset>,
    );
    const legend = container.querySelector('[data-slot="field-legend"]');
    expect(legend?.getAttribute("data-variant")).toBe("label");
    cleanup();
  });

  it("renders FieldGroup", () => {
    const { container } = render(
      <FieldGroup>
        <div>child</div>
      </FieldGroup>,
    );
    const group = container.querySelector('[data-slot="field-group"]');
    expect(group).toBeTruthy();
    cleanup();
  });

  it("renders Field with vertical orientation (default)", () => {
    const { container } = render(
      <Field>
        <label>Hotel Name</label>
        <input type="text" />
      </Field>,
    );
    const field = container.querySelector('[data-slot="field"]');
    expect(field).toBeTruthy();
    expect(field?.getAttribute("data-orientation")).toBe("vertical");
    cleanup();
  });

  it("renders Field with horizontal orientation", () => {
    const { container } = render(
      <Field orientation="horizontal">
        <label>Name</label>
        <input type="text" />
      </Field>,
    );
    const field = container.querySelector('[data-slot="field"]');
    expect(field?.getAttribute("data-orientation")).toBe("horizontal");
    cleanup();
  });

  it("renders Field with responsive orientation", () => {
    const { container } = render(
      <Field orientation="responsive">
        <label>Responsive</label>
        <input type="text" />
      </Field>,
    );
    const field = container.querySelector('[data-slot="field"]');
    expect(field?.getAttribute("data-orientation")).toBe("responsive");
    cleanup();
  });

  it("renders FieldContent", () => {
    const { container } = render(
      <FieldContent>
        <p>Content here</p>
      </FieldContent>,
    );
    const content = container.querySelector('[data-slot="field-content"]');
    expect(content).toBeTruthy();
    cleanup();
  });

  it("renders FieldLabel", () => {
    render(<FieldLabel>My Label</FieldLabel>);
    const label = screen.getByText("My Label");
    expect(label.getAttribute("data-slot")).toBe("field-label");
    cleanup();
  });

  it("renders FieldTitle", () => {
    render(<FieldTitle>Field Title</FieldTitle>);
    expect(screen.getByText("Field Title")).toBeTruthy();
    cleanup();
  });

  it("renders FieldDescription", () => {
    render(<FieldDescription>Some description text</FieldDescription>);
    const desc = screen.getByText("Some description text");
    expect(desc.getAttribute("data-slot")).toBe("field-description");
    cleanup();
  });

  it("renders FieldSeparator without children", () => {
    const { container } = render(<FieldSeparator />);
    const sep = container.querySelector('[data-slot="field-separator"]');
    expect(sep).toBeTruthy();
    // data-content should be false when no children
    expect(sep?.getAttribute("data-content")).toBe("false");
    cleanup();
  });

  it("renders FieldSeparator with children text", () => {
    render(<FieldSeparator>OR</FieldSeparator>);
    expect(screen.getByText("OR")).toBeTruthy();
    const sep = document.querySelector('[data-slot="field-separator"]');
    expect(sep?.getAttribute("data-content")).toBe("true");
    cleanup();
  });

  it("renders FieldError with children (direct content)", () => {
    render(<FieldError>This field is required</FieldError>);
    expect(screen.getByText("This field is required")).toBeTruthy();
    cleanup();
  });

  it("renders FieldError returns null when no content", () => {
    const { container } = render(<FieldError />);
    expect(container.firstChild).toBeNull();
    cleanup();
  });

  it("renders FieldError with single error in errors array", () => {
    render(
      <FieldError errors={[{ message: "Invalid price" }]}>
        {undefined}
      </FieldError>,
    );
    expect(screen.getByText("Invalid price")).toBeTruthy();
    cleanup();
  });

  it("renders FieldError with multiple errors as list", () => {
    render(
      <FieldError
        errors={[
          { message: "Error one" },
          { message: "Error two" },
          { message: "Error three" },
        ]}
      />,
    );
    expect(screen.getByText("Error one")).toBeTruthy();
    expect(screen.getByText("Error two")).toBeTruthy();
    expect(screen.getByText("Error three")).toBeTruthy();
    const list = document.querySelector("ul");
    expect(list).toBeTruthy();
    cleanup();
  });

  it("renders FieldError with empty errors array (returns null)", () => {
    const { container } = render(<FieldError errors={[]} />);
    expect(container.firstChild).toBeNull();
    cleanup();
  });

  it("renders FieldError with duplicate errors (deduplication)", () => {
    render(
      <FieldError
        errors={[
          { message: "Duplicate error" },
          { message: "Duplicate error" },
        ]}
      />,
    );
    // Should only show once due to deduplication using Map
    const elements = screen.getAllByText("Duplicate error");
    expect(elements.length).toBe(1);
    cleanup();
  });

  it("renders FieldError with errors containing undefined message", () => {
    const { container } = render(
      <FieldError errors={[undefined, { message: undefined }]} />,
    );
    // All messages are undefined, so content is null
    expect(container.firstChild).toBeNull();
    cleanup();
  });

  it("renders full Field composition", () => {
    render(
      <FieldSet>
        <FieldLegend>Hotel Details</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <FieldDescription>Enter the hotel name</FieldDescription>
            <input type="text" id="name" />
            <FieldError errors={[{ message: "Name is required" }]} />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel>Price</FieldLabel>
            <FieldContent>
              <FieldTitle>Price Details</FieldTitle>
              <input type="number" />
            </FieldContent>
          </Field>
          <FieldSeparator>AND</FieldSeparator>
        </FieldGroup>
      </FieldSet>,
    );
    expect(screen.getByText("Hotel Details")).toBeTruthy();
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Enter the hotel name")).toBeTruthy();
    expect(screen.getByText("Name is required")).toBeTruthy();
    expect(screen.getByText("Price Details")).toBeTruthy();
    expect(screen.getByText("AND")).toBeTruthy();
    cleanup();
  });
});

// ─────────────────────────────────────────────────────────────
// Barrel import coverage (components/index.ts → components/ui/index.ts)
// ─────────────────────────────────────────────────────────────
describe("Barrel import coverage", () => {
  it("exports Button from @/components", () => {
    expect(Button).toBeDefined();
  });

  it("exports Input from @/components", () => {
    expect(Input).toBeDefined();
  });

  it("exports all Select components from @/components", () => {
    expect(Select).toBeDefined();
    expect(SelectContent).toBeDefined();
    expect(SelectGroup).toBeDefined();
    expect(SelectItem).toBeDefined();
    expect(SelectLabel).toBeDefined();
    expect(SelectSeparator).toBeDefined();
    expect(SelectTrigger).toBeDefined();
    expect(SelectValue).toBeDefined();
  });

  it("exports all Card components from @/components", () => {
    expect(Card).toBeDefined();
    expect(CardHeader).toBeDefined();
    expect(CardFooter).toBeDefined();
    expect(CardTitle).toBeDefined();
    expect(CardAction).toBeDefined();
    expect(CardDescription).toBeDefined();
    expect(CardContent).toBeDefined();
  });

  it("exports Alert components from @/components", () => {
    expect(Alert).toBeDefined();
    expect(AlertTitle).toBeDefined();
    expect(AlertDescription).toBeDefined();
  });

  it("exports all Field components from @/components", () => {
    expect(Field).toBeDefined();
    expect(FieldGroup).toBeDefined();
    expect(FieldLabel).toBeDefined();
    expect(FieldSet).toBeDefined();
    expect(FieldError).toBeDefined();
    expect(FieldLegend).toBeDefined();
    expect(FieldContent).toBeDefined();
    expect(FieldTitle).toBeDefined();
    expect(FieldDescription).toBeDefined();
    expect(FieldSeparator).toBeDefined();
  });

  it("exports Label and Separator from @/components", () => {
    expect(Label).toBeDefined();
    expect(Separator).toBeDefined();
  });
});
