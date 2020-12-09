import * as path from 'path';
import modulealias from 'module-alias';

const files = path.resolve(__dirname, '../../');

modulealias.addAliases({
  '@src': path.join(files, 'src'), 
  '@__tests__': path.join(files, '__tests__')
});
