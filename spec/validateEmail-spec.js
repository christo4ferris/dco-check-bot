var validateEmail = require('../src/validateEmail');

describe("validateEmail", function() {
	it("should find chris.ferris@gmail.com to be a valid email", function() {
		expect(validateEmail("chris.ferris@gmail.com")).toBe(true);
	});
	it("should find invalid email with missing tld", function() {
		expect(validateEmail("chris.ferris@gmail")).toBe(false);
	});
	it("should find invalid email with space", function() {
		expect(validateEmail("chris. ferris@gmail.com")).toBe(false);
	});
});
