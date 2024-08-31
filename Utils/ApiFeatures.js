class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){

        const excludeFields = ['sort', 'page', 'limit', 'fields'];
        const queryObj = { ...this.queryStr }
        excludeFields.forEach((el) => {
            delete queryObj[el]
        })
        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        let queryOb = JSON.parse(queryString)
        this.query  = this.query.find(queryOb);
        return this;
    }

    sort(){
        if(this.queryStr.sort){
            this.query = this.query.sort(this.queryStr.sort)
        }
        return this;
    }

    limitFields(){
          if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            console.log(fields)
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this;
    }

    // pagination(){
    //     const page = this.queryStr.page * 1 || 1
    //     const limit = this.queryStr.limit * 1 || 10
    //     const skip = (page - 1) * limit;
    //     this.query = this.query.skip(skip).limit(limit)
    //     // if (req.query.page) {
    //     //     const moviesCount = await Movie.countDocuments()
    //     //     if (skip >= moviesCount) {
    //     //         throw new Error('Page not found');
    //     //     }
    //     // }
        // return this;
    // }
}


module.exports= ApiFeatures;