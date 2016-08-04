import modelFactory from '../../lib/sqlModelFactory';

const userModel = modelFactory('users');

userModel.create = function(user) {
  user.points = user.points || 0;
  const query = `
    INSERT INTO ${this.tableName}
    (auth_provider, auth_provider_id, name, email, image_url, points)
    VALUES (
      $/auth_provider/,
      $/auth_provider_id/,
      $/name/,
      $/email/,
      $/image_url/,
      $/points/
    )
    RETURNING ID
  `;
  return this.db.one(query, user)
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
      return this.create(user).then(returned => {
        user.id = returned.id;
        return user;
      })
    })
  return response;
}

userModel.addPoints = function(userId, points) {
  const query = `
    UPDATE ${this.tableName}
    SET points = points + $/points/
    WHERE id = $/userId/
    RETURNING points AS points
  `;
  return this.db.one(query, {userId, points})
    .then(returned => returned.points)
    .catch(error => error)
    .finally(this.close())
}

userModel.getLeaders = function(offset = 0, limit = 20) {
  const query = `
    SELECT * FROM ${this.tableName} WHERE points > 0
    ORDER BY points DESC
    LIMIT $1
    OFFSET $2
  `;
  return this.db.many(query, [limit, offset])
}

export default userModel;
