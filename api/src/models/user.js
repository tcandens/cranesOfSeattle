import modelFactory from './base';
import Promise from 'bluebird';

const userModel = modelFactory('users');

userModel.create = function(user) {
  const query = `
    INSERT INTO ${this.tableName}
    (google_id, name, email, image_url)
    VALUES (
      $/google_id/,
      $/name/,
      $/email/,
      $/image_url/
    )
    RETURNING ID
  `;
  const response = this.db.one(query, user)
    .finally(this.close());
  return response;
}

userModel.findOrCreate = function(user) {
  const query = `
    SELECT *
    FROM ${this.tableName}
    WHERE google_id = $/google_id/
  `;
  const response = this.db.one(query, user)
    .then(foundUser => {
      return foundUser;
    })
    .catch(error => {
      console.warn('User not found. Creating user %s', user.name)
      return this.create(user).then(id => {
        user.id = id;
        return user;
      })
    })
    .finally(this.close());
  return response;
}

export default userModel;
