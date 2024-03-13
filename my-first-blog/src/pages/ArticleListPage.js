import articles from "./article-content"; 
import ArticlesList from '../components/ArticlesList';

const ArticleListPage = () => {
  return (
    <div className="articles">
      <h1>Articles</h1>
      <ArticlesList articles={articles}/>
    </div>
  );
}
export default ArticleListPage;