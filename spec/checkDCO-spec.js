var checkDCO = require('../src/checkDCO');

describe("checkDCO", function() {
	it("should find 'Signed-off-by: Christopher Ferris <chris.ferris@gmail.com>' to be a valid sign-off", function() {
		expect(checkDCO("foo bar Signed-off-by: Christopher Ferris <chris.ferris@gmail.com>")).toBe(true);
	});
	it("should flag invalid email with missing tld", function() {
		expect(checkDCO("foo bar Signed-off-by: Christopher Ferris <chris.ferris@gmail>")).toBe(false);
	});
	it("should flag invalid email with space", function() {
		expect(checkDCO("foo bar Signed-off-by: Christopher Ferris <chris. ferris@gmail.com>")).toBe(false);
	});
  it("should flag missing email", function() {
		expect(checkDCO("foo bar Signed-off-by: Christopher Ferris")).toBe(false);
	});
  xit("should flag missing name", function() {
		expect(checkDCO("foo bar Signed-off-by: <chris.ferris@gmail.com>")).toBe(false);
	});
  it("should flag missing name and email", function() {
		expect(checkDCO("foo bar Signed-off-by: ")).toBe(false);
	});
});
