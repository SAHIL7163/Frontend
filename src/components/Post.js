import React from 'react'
import { Link } from 'react-router-dom'
import useWindowsize from '../hooks/useWindowsize';
import { useNavigate } from 'react-router-dom';


const Post = ({post,postIndex}) => {
  const navigate=useNavigate();
  const {width}=useWindowsize();
  const categories =['Travel','Tech','Finance','Fashion','Food','PesonalBlog','Sports'];
  
  const handleReadMoreClick = async () => {
    // Navigate to the root URL
    await navigate('/'); 
    // Navigate to the post details page
   await navigate(`/post/${post._id}`);

  };

  function removeHtmlTags(str) {
    return str.replace(/<[^>]*>/g, '');
}
   const cleanString = removeHtmlTags(post.body);




  const truncatedText = cleanString.length <=25 ? cleanString : `${(cleanString).slice(0,200)}...` ;  // Adjust the slice length as needed
  return (
   <article className="post">
    <div className="post-container">
    <div className='post-image-1 d-flex flex-column justify-content-center'>
      <div>
          {(postIndex % 2 !== 0  ||  width <=768 )? (
            <img className="img-fluid" src={`${post.imageUrl}`} alt='' />
          ) : null}
        </div>
    </div>
      <div className='post-content d-flex flex-column justify-content-center'>
     <h2 className='postTitle'>{post.title}</h2>
{/*      <h5>{post._id}</h5> */}
    <p className="postDate" >{post.datetime}</p>
<p className="postcategory">{categories[post.categoryId]}</p>
<p>{truncatedText}</p> 
     <div className='post-button'>
      <button  className='btn btn-lg btn-primary' onClick={handleReadMoreClick}>Read More</button>
       </div>
       </div>
     {/*   <div className='post-image d-flex flex-column justify-content-center'>
   <img  className="img-fluid" src={`http://localhost:3500/${post.imageUrl}`}/>
   </div>  */}
     <div className='post-image-2 d-flex flex-column justify-content-center'>
          {(postIndex % 2 === 0  && width>768)? (
            <img className="img-fluid" src={`${post.imageUrl}`} alt='' />
          ) : null}
        </div>
    </div>
   </article>
  )
}

export default Post
