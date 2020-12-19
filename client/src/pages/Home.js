import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks';
import { Grid } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
    const { user } = useContext(AuthContext);
    const { loading, data, error } = useQuery(FETCH_POSTS_QUERY);

    if (loading) return 'Loading...'
    if (error) return `Error ${error.message}`;

    // test for data coming into the Component
    if(data) {
        console.log(data);
        console.log('data.getPosts >>', data.getPosts);
    }

     return (
        <Grid columns={3} divided>
            <Grid.Row className='page-title'>
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm / >
                    </Grid.Column>
                )}
                {loading ? (
                    <h1>Loading Post..</h1>
                ) : ( 
                    data.getPosts.map(post => (
                        <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                            <PostCard post={post} />
                        </Grid.Column>
                    ))
                )}
            </Grid.Row>
        </Grid>
    )
}


export default Home;