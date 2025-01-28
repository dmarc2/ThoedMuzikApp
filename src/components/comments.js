import { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import './comments.css';
import {apiClient, handleAPIError} from '../global.js';

export default function Comments(params) {
    let username = params.username;
    let songId = params.songId;
    // const [comments, setComments] = useState([]);
    let comments = [];

    useEffect(()=>{
        fetchComments();
    });

    async function fetchComments() {
        $("#comments-sect> div:last-child").html("");
        try {
            const r = await apiClient.get("/api/comments/"+songId);
            comments = r.data;
            //   console.log(r.data);
            //   console.log("comments: " + comments);

            $('#comments-len').html(`${comments.length} Comments`);
            
            comments.forEach(comment => {
                $("#comments-sect> div:last-child").append("<div class='comment'><div class='profile-img'></div><div><span>"+comment.username+"</span><span>"+comment.timestamp+"</span><p>"+comment.data+"</p></div><img src='/more.png' alt='more button'></div>");
            });
        } catch (error) {
            handleAPIError(error);
            return; // Exit if there's an error
        }
    }

    async function addComment() {
        if(username == "Guest") {
            alert("Sign in or Create an account to comment.");
            return;
        } 

        let timestamp = new Date().toDateString();
        let comment = $("#comment-input").val();

        try {
            await apiClient.post("/api/comments/"+songId+"/"+username+"/"+timestamp+"/"+comment)
            .then(response => {
                if(response.status == 200) {
                    document.location.reload();
                }
                else {
                    alert("Failed saving comment");
                }
            })
            .catch(error => {
                console.error("Error saving comment: ", error);
            });
        } catch (error) {
            handleAPIError(error);
            return; // Exit if there's an error
        }
    }

    return (
        <div id="comments-sect">
          <h2 id='comments-len'>{comments.length} Comments</h2>
          <div>
            <div className='comment-btn' onClick={addComment}>Comment</div>
            <input type='text' placeholder='Add a comment...' id='comment-input'></input>
          </div>
          <div></div>
        </div>
    );
}