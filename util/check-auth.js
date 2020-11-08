const { AuthenticationError } = require('apollo-server');

console.log('AuthenticationError ==>', AuthenticationError);

const jwt = require('jsonwebtoken');
const {  SECRET_KEY } = require('../config');

module.exports = (context) => {
    // context  = { ...header }
    const authHeader = context.req.headers.authorization;

    if(authHeader) {
        // grab token 
        const token = authHeader.split('Bearer ')[1]
        if(token) {
            try {
                // grab user 
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch(err) {
                throw new AuthenticationError('Invalid Expired Token');
            }
        }
        throw new AuthenticationError('Authentication token must be \'Bearer [token] ')
    } 
    throw new AuthenticationError('Authorization error must be provided');
}