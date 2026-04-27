class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering: gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search(fields) {
    if (this.queryString.search) {
      const regex = new RegExp(this.queryString.search, 'i');
      const searchQuery = fields.map((field) => ({ [field]: regex }));
      this.query = this.query.find({ $or: searchQuery });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page  = parseInt(this.queryString.page, 10)  || 1;
    const limit = parseInt(this.queryString.limit, 10) || 20;
    const skip  = (page - 1) * limit;
    this.query  = this.query.skip(skip).limit(limit);
    this.page   = page;
    this.limit  = limit;
    return this;
  }
}

module.exports = APIFeatures;
