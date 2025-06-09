export const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const isValidPassword = (password) => {
	// Password must be at least 6 characters long
	let charTest = password.length >= 6;

	// Password must contain at least one uppercase letter, one lowercase letter, and one number
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
	let regexTest = passwordRegex.test(password);

	// Return true if both tests pass
	return charTest && regexTest;
};

export const isValidConfirmPassword = (password, confirmPassword) => {
	// Confirm password must match the original password
	return password === confirmPassword;
};
