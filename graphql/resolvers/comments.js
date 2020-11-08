const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { username } = checkAuth(context);
            // check if the form entry is empty 
            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Coomment body must not be empty'
                    }
                });
            }

            // if its not empty post the entry to the DB 
            const post = await Post.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                });
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        },
        async deleteComment(_, { postId, commentId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            // get the index of the comment in the array of comments
            // then delete index
            if (post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                // if another user is trying to delete a comment
                if(post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;                
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            }   else {
                throw new UserInputError('Post not found');
            }
        }
    }
}