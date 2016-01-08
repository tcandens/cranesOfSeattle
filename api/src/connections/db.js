import info from './db_info'
import options from './db_options'
import pgp from 'pg-promise'
import extensions from './db_extensions'

const db = pgp(options)(info);

extensions(db);

export default db
