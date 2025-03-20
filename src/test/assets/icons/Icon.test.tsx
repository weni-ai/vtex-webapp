import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Icon from "../../../assets/icons/Icon";
import { expect, describe, it } from "vitest";

import manageSearchIcon from "../../../assets/icons/manage_search.svg";
import neurologyIcon from "../../../assets/icons/neurology.svg";
import volunteerActivismIcon from "../../../assets/icons/volunteer_activism.svg";

describe("Icon Component", () => {
    it("renders the manage search icon correctly", () => {
        render(<Icon icon="manage_search" />);
        const img = screen.getByTestId("manage_search");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", manageSearchIcon);
    });

    it("renders the neurology icon correctly", () => {
        render(<Icon icon="neurology" />);
        const img = screen.getByTestId("neurology");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", neurologyIcon);
    });

    it("renders the volunteer activism icon correctly", () => {
        render(<Icon icon="volunteer_activism" />);
        const img = screen.getByTestId("volunteer_activism");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", volunteerActivismIcon);
    });
});