import AlpineLibrary from './node_modules/alpine/src/alpine/alpineLibrary';
import config from '{{=it.project.confFile}}';

{{~it.project.imports :value}}
{{=value}}
{{~}}

export default AlpineLibrary({
  ...config,
  build: true,
  methods: {{=it.project.methods}},
});
