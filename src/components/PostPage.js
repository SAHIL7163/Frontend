import React, { useState,useEffect ,useRef} from 'react'
import { useParams,Link } from 'react-router-dom'
import axios from '../api/posts'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { Container } from 'react-bootstrap';
import { FaThumbsUp, FaThumbsDown, FaComment, FaShare } from 'react-icons/fa';
import Commentsection from './Commentsection'

const ROLES = 
{
  'User': 2001 ,
  'Editor' : 1984 ,
  'Admin' : 5150
}

const PostPage = ({posts,handleDelete}) => {
  const axiosPrivate = useAxiosPrivate();
  const{ id }=useParams(); 
  const[post ,setPost] =useState('');
  const[isLoading ,SetLoading] =useState(true);
  const[error ,setError] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);  // Track if the user has liked
  const [dislikes, setDislikes] = useState(0);
  const [hasDisliked, setHasDisliked] = useState(false); 
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
 
  const { auth } = useAuth();
  
  useEffect(() => {
    const fetchPost = async () => {      
      try {
        const response = await axiosPrivate.get(`/posts/${id}`);
        setPost(response.data);
        setLikes(response.data.likes || 0); // Safely handle undefined
        setDislikes(response.data.dislikes || 0);
      } catch (err) {
        console.log(err);
        setError('Post Not found')
      }
      finally{
        SetLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (auth?.user?.username) {
      setHasLiked(post?.usersLiked?.includes(auth.user.username));
      setHasDisliked(post?.usersDisliked?.includes(auth.user.username));
    }
  }, [post, auth?.user?.username]);
  
   
  
  const isAdmin = auth?.roles?.includes(ROLES.Admin); 
  const postBody = post.body;

  
  const handleLike = async () => {
  /*   if (hasLiked ){
     return; // Prevent multiple likes
    } */
    try {
      const response = await axios.put(`/posts/${id}/like`, {
        username: auth?.user.username, // Username of the currently logged-in user
        action: 'like', // The action (like or dislike)
      });
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setHasLiked(!hasLiked);
      setHasDisliked(false);
      console.log('Request payload:', {
        username: auth?.user.username,
        action: 'like',
      });
    } catch (err) {
      console.log('Request payload:', {
        username: auth?.user.username,
        action: 'like',
      });
      console.error('Error details:', err); // Log full error for debugging
      const errorMessage = err.response?.data?.message || 'Unexpected error occurred while liking the post';
      setError(errorMessage);
    }
  };

  const handleDislike = async () => {
   // if (hasDisliked) return;  // Prevent multiple dislikes
    try {
    
      const response = await axios.put(`/posts/${id}/like`, {
        username: auth?.user.username, // Username of the currently logged-in user
        action: 'dislike', // The action (like or dislike)
      });
      setDislikes(response.data.dislikes);
      setLikes(response.data.likes);
      setHasDisliked(!hasDisliked); 
      setHasLiked(false); // Mark as disliked
    } catch (err) {
      setError('Error while disliking the post');
 
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: 'Check out this blog post!',
        url: window.location.href,
      }).catch((err) => console.log('Sharing failed', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const commentSectionRef = useRef(null);

  // Function to scroll to the comment section
  const toggleComments = () => {
    setIsCommentsVisible((prev) => !prev); // Toggle visibility
    if (!isCommentsVisible && commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  if (!postBody) {
    return null; // or some default content or message
  }
 const paragraphs = postBody.split('\n');


    return (
 <main className="PostPage">
  {isLoading && <p className='statusMsg mt-4'>Loading post...</p>}
  {error && <p className='statusMsg mt-4' style={{
    color:"red"
   }}>{error}</p>}

{!isLoading && !error && <article className=""> 
  {post && 
  <>
   <h2 className='postitle'>{post.title}</h2>
   <p className="postDate">{post.datetime}</p>
   <p>{post.user}</p>
   <div className='d-flex justify-content-center'>
   <img  className="img-fluid" style ={{ 'width': '650px',display:'block' }}src={`${post.imageUrl}`}/>
   </div>
 {/*  <p style={{ whiteSpace: 'pre-line', textIndent: '2em'}} className="my-5 postBody ps-4">{post.body}</p>  */}
 <article className="scrollable-content my-5">
      <Container>
       {paragraphs.map((paragraph, index) => (
          <p key={index} className="post-para">
          <span className="content" dangerouslySetInnerHTML={{__html:paragraph}} />
          </p>
        ))}
      </Container>
    </article>
    </>}
{(auth.user.username === post.user) &&
  
      <div className='justify-content-center'>
   <Link to={`/edit/${post._id}`}><button className='btn btn-lg btn-primary' type='button'>Edit Blog</button></Link>
   <button className='btn btn-lg delete-button btn-secondary' type='button' onClick={()=>handleDelete(post._id)}>
  Delete Blog
</button>
    </div> 
  }
  
  
  {!post &&
   <>
     <h2>Post Not Found</h2>
     <p>Well, that's disappointing.</p>
       <p>
        <Link to='/'>Visit Our Homepage</Link>
        </p>
       </>
     }
   </article>
} 
{/* { display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '20px' }
 */}   {/* Like, Comment, Share Section */}
<div className='postpage-icons'>
  {/* Like Button */}
  <button
    onClick={handleLike}
    style={{
      color: hasLiked ? 'blue' : 'gray',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

    }}
  >  
      <div style={{display:'flex' , alignItems:'center'}}>
    <span className='like'><FaThumbsUp  /></span>
    <span className='likeno'>{likes}</span>
    </div>
  </button>

  {/* Dislike Button */}
  <button 
    onClick={handleDislike}
    style={{
      color: hasDisliked ? 'red' : 'gray',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >  
   <div style={{display:'flex' , alignItems:'center'}}>
    <span className='dislike'><FaThumbsDown  /></span>
    <span  className='dislikeno'>{dislikes}</span>
    </div>
  </button>

  {/* Comments Button */}
  <button
          onClick={toggleComments}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
             display:'flex',
             alignItems:'center'
          }}
        >
             <div style={{display:'flex' , alignItems:'center'}}>
          <span><FaComment className='comment' style={{ color: 'gray' }} /></span>
          </div>
          <span className="hide-on-small" style={{ fontSize: '1.5rem', marginLeft: '5px' }}>Comments</span>
        </button>

  {/* Share Button */}
  <button
    className="btn"
    onClick={handleShare}
    style={{
      background: 'none',
      color:'gray',
      border: 'none',
      cursor: 'pointer',
       display:'flex',
       alignItems:'center'
   
    }}
  > 
     <div style={{display:'flex' , alignItems:'center'}}>
    <span className='share'><FaShare/></span>
     <span className="hide-on-small" style={{ fontSize: '1.5rem', marginLeft: '5px',color:'white' }}>Share</span> 
     </div> </button>
</div>

{isCommentsVisible && (
        <div
          ref={commentSectionRef}
          style={{
            marginTop: '20px',

            border: '1px solid lightgray',
            borderRadius: '5px',
          }}
        >
          {/* Replace the below with actual comments */}
        <Commentsection postId={id}/>
          {/* Add your comment input or display logic here */}
        </div>
      )}

    </main>
  )
}

export default PostPage





{/* <div className='d-flex justify-content-center'>
   <Link to={`/edit/${post._id}`}><button className='btn btn-lg btn-primary' type='button'>Edit Blog</button></Link>
   <button className='btn btn-lg delete-button btn-secondary' type='button' onClick={()=>handleDelete(post._id)}
   disabled={!isAdmin}>
  Delete Blog
</button>

   </div> */}
