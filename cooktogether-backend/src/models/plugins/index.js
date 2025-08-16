/* eslint-disable no-param-reassign */

const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc).
   * @param {Object} [options.sort] - Mongoose-style sorting object, e.g., { createdAt: -1 }. This takes priority.
   * @param {string} [options.populate] - Populate data fields.
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options = {}) {
    // --- START OF CORRECTIONS ---

    // 1. CORRECTED DEFAULT: Default to 'latest' (createdAt descending).
    let sort = '-createdAt';

    // 2. NEW LOGIC BLOCK: Prioritize the Mongoose-standard 'sort' object if it exists.
    if (options.sort && typeof options.sort === 'object') {
      sort = options.sort;
    }
    // Otherwise, use the existing 'sortBy' string parsing as a fallback.
    else if (options.sortBy) {
      const sortingCriteria = options.sortBy.split(',').map((sortOption) => {
        const [key, order] = sortOption.split(':');
        return (order === 'desc' ? '-' : '') + key;
      });
      sort = sortingCriteria.join(' ');
    }

    // --- END OF CORRECTIONS ---

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    // The .sort() method in Mongoose can handle both object and string formats,
    // so this line works perfectly with our new logic.
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

      if (options.populate) {
      if (typeof options.populate === 'string') {
        options.populate.split(',').forEach((populateOption) => {
          docsPromise = docsPromise.populate(
            populateOption
              .split('.')
              .reverse()
              .reduce((a, b) => ({ path: b, populate: a }))
          );
        });
      } else if (typeof options.populate === 'object') {
        docsPromise = docsPromise.populate(options.populate);
      }
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return result;
    });
  };
};

/* eslint-disable no-param-reassign */

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const deleteAtPath = (obj, path, index) => {
    if (index === path.length - 1) {
        delete obj[path[index]];
        return;
    }
    deleteAtPath(obj[path[index]], path, index + 1);
};

const toJSON = (schema) => {
    let transform;
    if (schema.options.toJSON && schema.options.toJSON.transform) {
        transform = schema.options.toJSON.transform;
    }

    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform(doc, ret, options) {
            Object.keys(schema.paths).forEach((path) => {
                if (schema.paths[path].options && schema.paths[path].options.private) {
                    deleteAtPath(ret, path.split('.'), 0);
                }
            });

            if (ret && ret._id) {
                ret.id = ret._id.toString();
            }
            delete ret._id;
            delete ret.__v;
            if (transform) {
                return transform(doc, ret, options);
            }
        },
    });
};

module.exports = { toJSON, paginate };
