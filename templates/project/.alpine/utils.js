module.exports = {
  cast: (val, type) => {
    switch (type.toLowerCase()) {
      case 'number':
        return Number.parseFloat(val);
      case 'string':
        return '' + val;
      case 'boolean':
        return val.toLowerCase() === 'true';
      default:
        return val;
    }
  },
};
