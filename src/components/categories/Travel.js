import React from 'react'
import Post from '../Post';

const Travel = ({posts}) => {
   /*  const[travelposts,setTravelPosts]=useState([]); */
   const financeposts = Array.isArray(posts)
   ? posts.filter(post => {
       console.log(post.categoryId); // Log categoryId to check its value
       return post.categoryId === 0;
     })
   : [];
   // Log the filtered posts

  return ( 
    <main className="Home d-flex flex-column justify-content-center">
      <h1 className='text-center'>Travel-Blogs</h1>
      {financeposts.length > 0 ? 
       (financeposts.map((post,index)=>(
    <Post key={post.id} post={post} postIndex={index} />
   ))
    ): <p className='emptycategory'>Loading...</p> }
    </main>
  )
}


export default Travel
