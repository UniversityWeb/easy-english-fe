const { override, useBabelRc, addBabelPlugin } = require('customize-cra');

// eslint-disable-next-line react-hooks/rules-of-hooks
module.exports = override(
  useBabelRc(),
  addBabelPlugin('@babel/plugin-proposal-private-property-in-object'),
);
