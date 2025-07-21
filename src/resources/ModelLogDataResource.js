// resources/ModelLogDataResource.js

class ModelLogDataResource {
  static toArray(data) {
    const resource = {};

    for (const [column, attribute] of Object.entries(data)) {
      try {
        const decoded = JSON.parse(attribute);
        resource[column] = typeof decoded === 'object' && decoded !== null
          ? decoded
          : attribute;
      } catch (e) {
        resource[column] = attribute;
      }
    }

    return resource;
  }
}

module.exports = ModelLogDataResource;
