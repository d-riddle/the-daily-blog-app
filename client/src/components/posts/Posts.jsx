import './posts.css'
import Post from '../post/Post.jsx'

function Posts({posts}){
    return (
        <div className="posts">
            {posts.map((p) => (
                <Post post={p} />
            ))}
        </div>
    );
}

export default Posts;