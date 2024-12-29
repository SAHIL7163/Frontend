import React, { useState, useEffect } from 'react';
import axios from '../api/posts';
import useAuth from '../hooks/useAuth';
import './Commentsection.css'; // You can create a separate CSS file for styling
import { AiFillDelete ,AiOutlinePlus} from 'react-icons/ai';
const Commentsection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const { auth } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/posts/${postId}/comments`);
        setComments(response.data);
      } catch (err) {
        setError('Failed to fetch comments.');
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments

    try {
      const response = await axios.post(`/posts/${postId}/comments`, {
        username: auth?.user.username,
        content: newComment,
      });
      setComments(response.data); // Update the comments state with the new list
      setNewComment(''); // Clear the input field
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`/posts/${postId}/comments/${commentId}`);
      setComments(response.data.comments); // Update the comments state with the remaining comments
    } catch (err) {
      setError('Failed to delete comment.');
    }
  };

  return (

    <div className="comment-section">
      {/* Comment Form at the top */}
      <div className="comment-form-container">
        <div className="comment-form">
          <textarea style={{padding:'3px',paddingLeft:'10px',fontSize:'1.2rem'}}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder=" Add a comment..."
            className="comment-input"
          ></textarea>
          <AiOutlinePlus className="add-btn" onClick={handleAddComment} >      
                </AiOutlinePlus>
        </div>
      </div>
    
      {/* Scrollable Comments List */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-card">
            <div className="comment-header">
              <p className="comment-username">{comment.username}</p>
              {comment.username === auth?.user.username && (
                <AiFillDelete className="delete-btn" onClick={() => handleDeleteComment(comment._id)}>
                </AiFillDelete>
              )}
            </div>
            <div className="comment-body">
            <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p>
              <p style={{marginBottom:'0.3rem'}} className="comment-content">{comment.content}</p>
    
             
            </div>
          </div>
        ))}
      </div>
    </div>
    



  );
};

export default Commentsection;
