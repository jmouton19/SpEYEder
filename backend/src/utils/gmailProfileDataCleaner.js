const cleanGmailProfileData = (data) => {
  let result = {};

  const processArray = (array) => {
    const primary =
      array.find((item) => item.metadata && item.metadata.primary) || array[0];
    return processData(primary);
  };

  const processData = (value) => {
    if (Array.isArray(value)) {
      return processArray(value);
    } else if (value !== null && typeof value === "object") {
      let nestedResult = {};
      Object.keys(value).forEach((key) => {
        if (key !== "metadata") {
          // Skip metadata
          nestedResult[key] = processData(value[key]);
        }
      });
      return nestedResult;
    }
    return value;
  };

  result = processData(data);
  return result;
};

module.exports = { cleanGmailProfileData };
