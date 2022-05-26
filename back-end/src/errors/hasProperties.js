function hasProperties(...properties) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      console.log("hasprops ", data)
      try {
        properties.forEach((property) => {
          if (!data[property] || data[property] == "") {
            const error = new Error(`A ${property} property is required.`);
            error.status = 400;
            throw error;
          }
        });
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  module.exports = hasProperties;