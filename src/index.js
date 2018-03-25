const memoizedSelector = (selector) => {
  return (...args) => {
    const result = selector(...args);
    if (selector(...args) !== result) {
      throw new Error('Memoization check failed');
    }

    return result;
  };
};

export default memoizedSelector;

