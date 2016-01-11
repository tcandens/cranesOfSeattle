import info from './db_info'
import options from './db_options'
import pgp from 'pg-promise'

const db = pgp(options)(info);

export default db
