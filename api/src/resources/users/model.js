import modelFactory from '../../lib/sqlModelFactory';

const userModel = modelFactory('users');

userModel.create = function(user) {
  const query = `
    INSERT INTO ${this.tableName}
    (auth_provider, auth_provider_id, name, email, image_url)
    VALUES (
      $/auth_provider/,
      $/auth_provider_id/,
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
    WHERE auth_provider = $/auth_provider/
    AND auth_provider_id = $/auth_provider_id/
    OR email = $/email/
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
