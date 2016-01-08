export default function (db) {
  const extensions = [
    'postgis'
  ]

  db.tx(t => {
    extensions.forEach(extension => {
      t.query(`CREATE EXTENSION IF NOT EXISTS ${extension};`)
    })
  })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    })

    return db;
}
