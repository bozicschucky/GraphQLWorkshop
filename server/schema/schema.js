const graphql = require("graphql");
const Post = require("../models/post");
const Author = require("../models/user");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = graphql;

const PostType = new GraphQLObjectType({
	name: "Post",
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		body: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				//get Author of posts
				return Author.findById(parent.authorId);
			}
		}
	})
});

const AuthorType = new GraphQLObjectType({
	name: "Author",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		age: { type: GraphQLInt },
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				//get Author of posts
				return Post.find({ authorId: parent.id });
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		post: {
			type: PostType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Post.findById(args.id);
			}
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Author.findById(args.id);
			}
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				return Post.find({});
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				return Author.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve(parent, args) {
				let author = new Author({
					name: args.name,
					email: args.email,
					age: args.age
				});
				return author.save();
			}
		},
		addPost: {
			type: PostType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				body: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parent, args) {
				let post = new Post({
					title: args.title,
					body: args.body,
					authorId: args.authorId
				});
				return post.save();
			}
		},
		updatePost: {
			type: PostType,
			args: {
				id: { type: GraphQLID },
				title: { type: new GraphQLNonNull(GraphQLString) },
				body: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parent, args) {
				return Post.findByIdAndUpdate(
					{ _id: args.id },
					{ title: args.title, body: args.body }
				);
			}
		},
		deletePost: {
			type: PostType,
			args: {
				id: { type: GraphQLID }
			},
			resolve(parent, args) {
				return Post.findByIdAndDelete({ _id: args.id });
			}
		}
	}
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
