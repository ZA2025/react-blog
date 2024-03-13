import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NotFoundPage from './NotFoundPage';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';
import useUser from '../hooks/useUser';
import articles from './article-content';
import { Link } from "react-router-dom";

const ArticlePage = () => {
  const [ articleInfo, setArticleInfo ] = useState({ 
    name: '',
    title: '',
    content: '',
    upvotes: 0,
    comments: [],
    hasUpvoted: false,
   });

  let { hasUpvoted } = articleInfo;
  const { id } = useParams();
  const { user, isLoading } = useUser();
   

  // fetch data from the server
  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && await user.getIdToken();
      const headers = token ? { authtoken: token } : {};
      const response = await axios.get(`/api/articles/${id}`, { headers });
      const newArticleInfo = response.data;
      const userHasVoted = user ? newArticleInfo.upvoteIds.includes(user.uid) : false;
      setArticleInfo(
        { ...newArticleInfo,
          hasUpvoted: userHasVoted,
        }
      );
    }
    
    loadArticleInfo();
    if (!isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user, id]);
   
  console.log("The user has:", hasUpvoted);
  const article = articles.find(article => article.name === id);

  // upovte an article
  const upvoteArticle = async () => {
    const token = user && await user.getIdToken();
    const headers = token ? { authtoken: token } : {};
    const response = await axios.put(`/api/articles/${id}/upvote`, null, { headers });
    const updatedArticleInfo = response.data;
    const userHasVoted = updatedArticleInfo.upvoteIds.includes(user.uid);
    //setArticleInfo(updatedArticleInfo);
     
    setArticleInfo({
      ...updatedArticleInfo,
      hasUpvoted: userHasVoted,
    });
    console.log(updatedArticleInfo);
  }
  // add upvotes 
  if (!article) return <NotFoundPage />;
  
  return (
    <>
      <h1>{articleInfo.title} for: {articleInfo.name}</h1>
      <p>{articleInfo.content}</p>
      <div className='upvote-section'>
        {user 
        ? <button 
            className={hasUpvoted ? 'like-class' : 'dislike-class'}
            onClick={upvoteArticle}>{hasUpvoted ? 'liked' : 'like'}
          </button>
        : <Link to="/login">Login to upvote</Link>
        }
        <p>This post has been upvoted {articleInfo.upvotes} times</p>
      </div>
      { user 
       ? <AddCommentForm 
        articleName={id} 
        onArticleUpdated={updatedArticleInfo => setArticleInfo(updatedArticleInfo)} 
      /> 
        : <Link to="/login">Login to add a comment</Link>}
      {articleInfo.comments && articleInfo.comments.length > 0 ? (
        <CommentsList comments={articleInfo.comments} />
      ) : (
        <p>No comments available</p>
      )}
    </>
  );
}
export default ArticlePage;