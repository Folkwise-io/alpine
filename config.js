// eslint-disable
module.exports = {
  messages: {
    MISSING_PROJECT_ROOT: () => 'Could not find the project root.',
    MISSING_ALPINE_ROOT: () => 'Could not find an Alpine project root.',
    MISSING_DESCRIPTION: () => 'No description has been added. Add a description using the `description` property on an Alpine method.',
    MISSING_VERSION: () => 'No version has been set for your project. You can set a version number using the `version` property in package.json.',
    DUPLICATE: name => `Duplicate: ${name} has been defined more than once`,
    INVALID_TYPE: type => `${type} is not valid.`,
    UNSUPPORTED_TYPE: type => `${type} is not supported.`,
  },
};
