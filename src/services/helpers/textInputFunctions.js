/*
 * This function formats a text input by removing any non-alphabetic characters.
 *
 * @param {string} input - The input text to be formatted.
 * @return {string} - The formatted text containing only alphabetic characters.
 */
export const handleNumberText = (input) => {
	let formattedInput = input.replace(/[^0-9]/g, "");
	return formattedInput;
};

/*
 * This function formats a decimal number input by removing any non-numeric characters
 * except for the decimal point. It ensures that there is at most one decimal point in the input.
 *
 * @param {string} input - The input text to be formatted.
 * @return {string} - The formatted text containing only numeric characters and at most one decimal point.
 */
export const handleDecimalNumberText = (input) => {
	let formattedInput = input.replace(/[^0-9.]/g, "");

	// Ensure there is at most one decimal point
	const decimalIndex = formattedInput.indexOf(".");
	if (decimalIndex !== -1) {
		formattedInput =
			formattedInput.slice(0, decimalIndex + 1) +
			formattedInput.slice(decimalIndex + 1).replace(/\./g, "");
	}

	return formattedInput;
};

/*
 * This function validates an email address using a regular expression.
 *
 * @param {string} email - The email address to be validated.
 * @return {boolean} - Returns true if the email is valid, false otherwise.
 */
export const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/*
 * This function validates a password based on specific criteria:
 * - Must be at least 6 characters long
 * - Must contain at least one uppercase letter, one lowercase letter, and one number
 * @param {string} password - The password to be validated.
 * @return {boolean} - Returns true if the password is valid, false otherwise.
 */
export const isValidPassword = (password) => {
	// Password must be at least 6 characters long
	let charTest = password.length >= 6;

	// Password must contain at least one uppercase letter, one lowercase letter, and one number
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
	let regexTest = passwordRegex.test(password);

	// Return true if both tests pass
	return charTest && regexTest;
};

/*
 * This function validates that the confirm password matches the original password.
 *
 * @param {string} password - The original password.
 * @param {string} confirmPassword - The confirm password to be validated.
 * @return {boolean} - Returns true if the confirm password matches the original password, false otherwise.
 */
export const isValidConfirmPassword = (password, confirmPassword) => {
	// Confirm password must match the original password
	return password === confirmPassword;
};
