import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/navbar.js';
import Hero from '../components/hero.js';
import Newsletter from '../components/newsletter.js';
import {SongListHorizontal} from "../components/songList_horizontal.js";
import Footer from '../components/footer.js';
import SessionManager from "../SessionManager.js";
import './App.css';
import { ErrorBoundary } from "react-error-boundary";

function App() {
  let sessionMananger = new SessionManager();
  let userAccount = null;
  let muzik = [];

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
      userAccount = await sessionMananger.getAccount();
      muzik = await sessionMananger.getMuzik();
      console.log("loading muzik: " + muzik.length + " songs");
      console.log("Content loaded.");
  }

  async function sortOnDate(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j].getPublishDate() < arr[j + 1].getPublishDate()) {
                [arr[j], arr[j + 1]] = 
                            [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
  }

  function sortOnViews(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            // Ensure getViewCount() returns a number
            const viewCountCurrent = parseInt(arr[j].getViewCount(), 10);
            const viewCountNext = parseInt(arr[j + 1].getViewCount(), 10);

            if (viewCountCurrent < viewCountNext) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
  }

  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
    <div className="App">
      <Navbar/>
      <Hero/>
      <section id='opening-sect'>
          <div className='about-us' onClick={()=>document.location.href="/about"}><h2>About Us</h2><div className='filter'></div></div>
          <div className='open-shop'><h2>Open Shop</h2><div className='filter'></div></div>
          <Link className='see-music' to="/muzik"><h2>See Music</h2> <div className='filter'></div></Link>
      </section>
      <SongListHorizontal id="latest-sect" title="Latest" artist="all" sorter={sortOnDate}/>
      <SongListHorizontal id="most-viewed-sect" title="Most Viewed" artist="all" sorter={sortOnViews}/>
      <SongListHorizontal id="todays-sel-sect" title="Today's Selection" artist="all" sorter={null}/>
      <section id='news-sect' style={{"display":"none"}}>
          <h2 className='section-title'>NEWS</h2>
          <div>
            <div>
                <div>
                  <div>
                    <h3>HEADLINE</h3>
                    <h4>Date posted</h4>
                    <h4>Author</h4>
                  </div>
                  <div>
                    <div className='left-btn-style2'>&lt;</div>
                    <div className='news-img-demo'></div>
                    <div className='right-btn-style2'>&gt;</div>
                  </div>
                  <div>
                    <div className='like-btn'></div>
                    <div className='share-btn'></div>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Euismod quis viverra nibh cras pulvinar mattis nunc sed blandit. Viverra adipiscing at in tellus integer. At consectetur lorem donec massa sapien faucibus. Faucibus purus in massa tempor nec feugiat nisl. Et tortor consequat id porta nibh venenatis. Augue interdum velit euismod in pellentesque massa placerat duis. Sed egestas egestas fringilla phasellus. Facilisi nullam vehicula ipsum a. Euismod quis viverra nibh cras. Nam aliquam sem et tortor.
                  </p>
                  <button>Read More</button>
                </div>

                <div>
                  <div className='news-card-nothumb'>
                    <h3>HEADLINE</h3>
                    <h4>Date Posted</h4>
                    <h4>Author</h4>
                    <h4>Likes | Shares</h4>
                  </div>
                  <div className='news-card-thumb'>
                    <div className='news-card-img-demo'></div>
                    <div>
                      <h3>HEADLINE</h3>
                      <h4>Date Posted</h4>
                      <h4>Author</h4>
                      <h4>Likes | Shares</h4>
                    </div>
                  </div>
                  <div className='news-card-nothumb'>
                    <h3>HEADLINE</h3>
                    <h4>Date Posted</h4>
                    <h4>Author</h4>
                    <h4>Likes | Shares</h4>
                  </div>
                  <div className='news-card-thumb'>
                    <div className='news-card-img-demo'></div>
                    <div>
                      <h3>HEADLINE</h3>
                      <h4>Date Posted</h4>
                      <h4>Author</h4>
                      <h4>Likes | Shares</h4>
                    </div>
                  </div>
                  <div className='news-card-nothumb'>
                    <h3>HEADLINE</h3>
                    <h4>Date Posted</h4>
                    <h4>Author</h4>
                    <h4>Likes | Shares</h4>
                  </div>
                  <div className='news-card-thumb'>
                    <div className='news-card-img-demo'></div>
                    <div>
                      <h3>HEADLINE</h3>
                      <h4>Date Posted</h4>
                      <h4>Author</h4>
                      <h4>Likes | Shares</h4>
                    </div>
                  </div>
                  <div className='news-card-nothumb'>
                    <h3>HEADLINE</h3>
                    <h4>Date Posted</h4>
                    <h4>Author</h4>
                    <h4>Likes | Shares</h4>
                  </div>
                  <div className='news-card-thumb'>
                    <div className='news-card-img-demo'></div>
                    <div>
                      <h3>HEADLINE</h3>
                      <h4>Date Posted</h4>
                      <h4>Author</h4>
                      <h4>Likes | Shares</h4>
                    </div>
                  </div>
                  <div className='news-card-nothumb'>
                    <h3>HEADLINE</h3>
                    <h4>Date Posted</h4>
                    <h4>Author</h4>
                    <h4>Likes | Shares</h4>
                  </div>
                  <div className='news-card-thumb'>
                    <div className='news-card-img-demo'></div>
                    <div>
                      <h3>HEADLINE</h3>
                      <h4>Date Posted</h4>
                      <h4>Author</h4>
                      <h4>Likes | Shares</h4>
                    </div>
                  </div>
                </div>
            </div>
          </div>
      </section>
      <Newsletter/>
      <Footer/>
    </div>
    </ErrorBoundary>
  );
}

export default App;