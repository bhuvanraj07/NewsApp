import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './News.css';
const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};


const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const result = await axios(
          'https://techcrunch.com/wp-json/wp/v2/posts?per_page=20&context=embed'
        );

        if (result.status !== 200) {
          throw new Error(`API error: ${result.status}`);
        }

        if (result.data.length === 0) {
          throw new Error('No news found.');
        }

        setNews(result.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    let errorMessage;

    if (error.response) {
      // Request was made but server responded with error status code
      errorMessage = `API error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage = 'Network issue. Please try again later.';
    } else {
      // Something else happened in making the request
      errorMessage = 'Error in fetching news. Please try again later.';
    }

    return <div className="error">{errorMessage}</div>;
  }

  return (
    <div className="news">
      {news.map((item) => (
        <div key={item.id} className="news-card">
          <img src={item.jetpack_featured_media_url} alt={item.title.rendered} />
          <h2>{item.title.rendered}</h2>
          <p dangerouslySetInnerHTML={{__html: item.excerpt.rendered}} />
          <a href={item.link}>Read more</a>
        </div>
      ))}
    </div>
  );
};

export default News;
