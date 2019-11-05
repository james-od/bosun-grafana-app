"use strict";

System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      module.exports = {
        testEnvironment: "node",
        transform: {
          "^.+\\.jsx?$": "babel-jest"
        }
      };
    }
  };
});
//# sourceMappingURL=jest.js.map
