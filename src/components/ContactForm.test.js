import React from "react";
import {
	getByLabelText,
	getByText,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("renders without errors", () => {
	render(<ContactForm />);
});

test("renders the contact form header", () => {
	const { getByText } = render(<ContactForm />);
	const header = getByText(/Contact Form/i);

	expect(header).toBeInTheDocument();
	expect(header).not.toBeUndefined();
	expect(header).toBeTruthy();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
	const { getByText } = render(<ContactForm />);
	const firstNameInput = screen.getByLabelText(/First name*/i);
	userEvent.type(firstNameInput, "Four");

	const error = getByText(/firstName must have at least 5 characters./i);

	expect(error).toBeInTheDocument();
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
	const { getByText } = render(<ContactForm />);
	const submitButton = screen.getByRole("button", { type: /submit/i });
	userEvent.click(submitButton);

	const error1 = getByText(/firstName must have at least 5 characters./i);
	const error2 = getByText(/lastName is a required field/i);
	const error3 = getByText(/email must be a valid email address/i);
	expect(error1).toBeVisible();
	expect(error2).toBeVisible();
	expect(error3).toBeVisible();
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
	const { getByText, getByLabelText } = render(<ContactForm />);
	const firstNameInput = getByLabelText(/First Name*/i);
	const lastNameInput = getByLabelText(/Last Name*/i);
	const emailInput = getByLabelText(/email/i);
	const submitButton = screen.getByRole("button", { type: /submit/i });

	userEvent.type(firstNameInput, "ABCDE");
	userEvent.type(lastNameInput, "FGHIJ");
	userEvent.type(emailInput, "");
	userEvent.click(submitButton);

	const error3 = getByText(/email must be a valid email address/i);
	expect(error3).toBeVisible();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
	const { getByText, getByLabelText } = render(<ContactForm />);

	const emailInput = getByLabelText(/email/i);

	userEvent.type(emailInput, "tiny#gmail.com");

	const error3 = getByText(/email must be a valid email address/i);
	expect(error3).toBeTruthy();
	expect(error3).toBeVisible();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
	const { getByText } = render(<ContactForm />);
	const submitButton = screen.getByRole("button", { type: /submit/i });
	userEvent.click(submitButton);

	const error2 = getByText(/lastName is a required field/i);
	expect(error2).toBeVisible();
	expect(error2).toBeTruthy();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
	const { getByText, getByLabelText } = render(<ContactForm />);

	let newContact = screen.queryByText(/ABCDE/i);
	expect(newContact).toBeNull();
	expect(newContact).not.toBeInTheDocument();

	const firstNameInput = getByLabelText(/First Name*/i);
	const lastNameInput = getByLabelText(/Last Name*/i);
	const emailInput = getByLabelText(/email/i);
	const submitButton = screen.getByRole("button", { type: /submit/i });

	userEvent.type(firstNameInput, "ABCDE");
	userEvent.type(lastNameInput, "FGHIJ");
	userEvent.type(emailInput, "alpha@gmail.com");
	userEvent.click(submitButton);

	newContact = getByText(/ABCDE/i);
	expect(newContact).toBeInTheDocument();
	expect(screen.queryByTestId(/messageDisplay/i)).toBeNull();
});

test("renders all fields text when all fields are submitted.", async () => {
	const { getByText, getByLabelText } = render(<ContactForm />);

	let newContact = screen.queryByText(/ABCDE/i);
	expect(newContact).toBeNull();
	expect(newContact).not.toBeInTheDocument();

	const firstNameInput = getByLabelText(/First Name*/i);
	const lastNameInput = getByLabelText(/Last Name*/i);
	const emailInput = getByLabelText(/email/i);
	const submitButton = screen.getByRole("button", { type: /submit/i });
	const messageInput = getByLabelText(/message/i);

	userEvent.type(firstNameInput, "ABCDE");
	userEvent.type(lastNameInput, "FGHIJ");
	userEvent.type(emailInput, "alpha@gmail.com");
	userEvent.type(messageInput, "this is a message.");
	userEvent.click(submitButton);

	newContact = getByText(/ABCDE/i);
	expect(newContact).toBeInTheDocument();
	expect(screen.getByTestId(/firstnameDisplay/i)).toBeVisible();
	expect(screen.getByTestId(/lastnameDisplay/i)).toBeVisible();
	expect(screen.getByTestId(/emailDisplay/i)).toBeVisible();
	expect(screen.getByTestId(/messageDisplay/i)).toBeVisible();
});
