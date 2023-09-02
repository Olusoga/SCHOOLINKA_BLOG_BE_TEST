/* eslint-disable linebreak-style */
import { resolve } from 'path';
import moduleAlias from 'module-alias';

moduleAlias.addAlias( 'src', resolve( __dirname, './' ) );
