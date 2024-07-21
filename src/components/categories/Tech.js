import React from 'react'
import Post from '../Post';

const Tech = ({posts}) => {
   /*  const[travelposts,setTravelPosts]=useState([]); */
   const techposts = Array.isArray(posts)
   ? posts.filter(post => {
       console.log(post.categoryId); // Log categoryId to check its value
       return post.categoryId === 1;
     })
   : [];
    
  return ( 
    <main className="Home d-flex flex-column justify-content-center">
      <h1 className='text-center'>Tech-Blogs</h1>
      {techposts.length > 0 ? 
       (techposts.map((post,index)=>(
    <Post key={post.id} post={post} postIndex={index} />
   ))
    ): <p className='emptycategory'>Loading...</p>}
    </main>
  )
}


export default Tech
