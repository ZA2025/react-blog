
import { Link } from "react-router-dom";
const ArticlesListPage = ({ articles }) => {
    return (
    <div>
        {articles.map((article, key) => (
            <Link className="article-list-item" key={key} to={`/articles/${article.name}`}>
                <h3>{article.title}</h3>
                <p>{article.content[0].substring(0, 150)} <span className="bold">read more...</span></p>
            </Link>
        ))}
    </div>
         
    );
}

export default ArticlesListPage;