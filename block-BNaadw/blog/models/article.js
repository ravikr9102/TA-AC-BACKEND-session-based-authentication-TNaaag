var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugify = require('slug-generator');

var articleSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: String,
    likes: { type: Number, default: 0 },
    comment: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    slug: { type: String, slug: "title"}
},{ timestamps: true });

articleSchema.pre('save' , async function(next){
    this.slug =  await slugify(this.title ,'_');
    this.slug =  await this.slug+ random(); 
    console.log('converted with the help of a package'+ this);
    return next();
})
function random(limit = 1000){
    return Math.floor(Math.random()*limit);
}

module.exports = mongoose.model('Article', articleSchema);