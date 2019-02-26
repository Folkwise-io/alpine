import AlpineLibrary from './alpineLibrary';
import { getConfiguration, importDir } from '../common/utils';

const Alpine = async (config = {}) => {
  const opts = {};

  // Get project configuration
  Object.assign(opts, config, await getConfiguration());

  // Require all the methods
  if (!opts.methods) {
    const methodDefinitions = await importDir(opts.methodsPath);
    const safeDefinitions = methodDefinitions.map(def => (def.default ? def.default : def));

    Object.assign(opts, {
      methods: safeDefinitions,
    });
  }

  return AlpineLibrary(opts);
};

export default Alpine;
