exports.up = function(pgm) {
  pgm.sql(`
    CREATE OR REPLACE FUNCTION notify_trigger() RETURNS trigger AS $$
    DECLARE
      user_id INTEGER;
      user_points INTEGER;
      user_image_url TEXT;
      user_name VARCHAR;
      new_json TEXT;
    BEGIN
      IF TG_TABLE_NAME = 'reports' THEN
        SELECT
        points, image_url, name, id
        INTO
        user_points, user_image_url, user_name, user_id
        FROM users WHERE id = NEW.user_id;
        new_json := json_build_object(
          'resource', TG_TABLE_NAME,
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(NEW.location)::json,
          'properties', json_build_object(
            'id', NEW.id,
            'user_id', NEW.user_id,
            'confidence', NEW.confidence,
            'user_name', user_name,
            'points', user_points,
            'user_image_url', user_image_url
          )
        )::text;
      ELSE
        new_json := json_build_object(
          'resource', TG_TABLE_NAME,
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(NEW.location)::json,
          'properties', json_build_object(
            'id', NEW.id,
            'permit', NEW.permit,
            'confidence', NEW.confidence,
            'user_id', NEW.user_id,
            'expiration_date', NEW.expiration_date,
            'address', NEW.address,
            'created_at', NEW.created_at
          )
        )::text;
      END IF;
      PERFORM pg_notify('watchers', new_json);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER reports_notify_insert AFTER INSERT ON reports FOR EACH ROW
    EXECUTE PROCEDURE notify_trigger();
    CREATE TRIGGER cranes_notify_insert AFTER INSERT ON cranes FOR EACH ROW EXECUTE
    PROCEDURE notify_trigger();
  `);
};

exports.down = function(pgm) {
  pgm.sql(`
    DROP TRIGGER cranes_notify_insert ON cranes;
    DROP TRIGGER reports_notify_insert ON reports;
    DROP FUNCTION notify_trigger();
  `);
};
