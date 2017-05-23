import React, { Component } from 'react';
import blog from 'github-blog-api';
import NavBar from './components/navbar';
import InfoBox from './components/infoBox';
import CategoryBox from './components/categoryBox';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    const app = blog({author:'geekodour',repo:'gitpushblog'});
    app.fetchBlogPosts().then(posts=>{
      this.setState({posts:posts});
    });
  }

  render() {
    return (
      <div className="App">
          <NavBar/>
          <div className="columns">
                  <div className="column">
                    <CategoryBox/>
                  </div>
                  <div className="column">
                    Recent Blogposts
                    {this.state.posts
                      ?this.state.posts.map(post=>{
                        return(
                        <div className="title is-6" key={post.id}>
                          {post.title}
                          <p>{post.body}</p>
                        </div>
                        );
                      })
                      :<p/>
                    }
                  </div>
                  <div className="column">
                    <InfoBox/>
                  </div>
          </div>
      </div>
    );
  }
}

export default App;
