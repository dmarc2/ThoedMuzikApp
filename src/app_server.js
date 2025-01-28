
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require("cors");

const thoedmuzikdb = new sqlite3.Database('C:\\Users\\marcu\\thoedmuzik.db', (error) => {
    if(error) {
        console.log("Could not connect to the thoedmuzikdb!\n" + error.message);
    }
    else {
        console.log("Connected to the thoedmuzikdb.");
    }
});

//Create an SQLite database
const muzikdb = new sqlite3.Database('C:\\Users\\marcu\\music.db', (error) => {
    if(error) {
        console.log("Could not connect to the muzikdb!\n" + error.message);
    }
    else {
        console.log("Connected to the muzikdb.");
    }
});

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
const port = 3000;

/*
    Insert a new email into the newsletter table.
*/
app.post('/api/newsletter/submit/:email', (req, res) => {
    thoedmuzikdb.run(`INSERT INTO newsletter VALUES(?,?,?,?,?,?,?,?,?)`, [req.params.email, true, true, true, true, true, true, true, true], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        // console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
});

/*
    Insert a new account into the account table.
*/
app.post('/api/account/signup/:username/:password', (req, res) => {
    thoedmuzikdb.run('INSERT INTO account VALUES(?,?,?)', ["profile", req.params.username, decodeURIComponent(req.params.password)], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error creating Account' });
            return;
        }
        else {
            res.status(200).json({message: "Account created"});
        }
    });
});

/*
    Delete a specified user account from the DB.
*/
app.post('/api/account/delete/:username', (req, res) => {
    thoedmuzikdb.run('DELETE FROM account WHERE username=?', [req.params.username], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error removing Account' });
            return;
        } else {
            res.status(200).json({message: "Account removed"});
        }
    });
});

/*
    This helper function is used to get the hashed password for a user account from the DB.
*/
function getHashedPassword(username) {
    return new Promise((resolve, reject) => {
        thoedmuzikdb.all('SELECT password FROM account WHERE username=?', [username], (err, rows) => {
            if (err) {
                reject('Error fetching Account');
            } else if (rows.length === 0) {
                reject('No account found');
            } else {
                resolve(rows[0].password);
            }
        });
    });
}

/*
    Checks if a login attempt is valid.
*/
app.post('/api/account/login/:username/:password', async (req, res) => {
    const hashedPassword = await getHashedPassword(req.params.username);

    const match = await bcrypt.compare(req.params.password, hashedPassword);
    if (match) {
        thoedmuzikdb.all('SELECT * FROM account WHERE username=? AND password=?', [req.params.username, hashedPassword], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching Account' });
        } else {
            res.send(rows);
        }
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

/*
    Insert a comment into the comments table for a specified song and user account.
*/
app.post('/api/comments/:songId/:username/:timestamp/:data', (req, res) => {
    thoedmuzikdb.all('INSERT INTO comment(songId, username, timestamp, data) VALUES(?,?,?,?)', [req.params.songId,req.params.username,req.params.timestamp,req.params.data], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error Inserting a Song Comment' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Set a specified col from the artist table to a provided val and update the table.
*/
app.post('/api/artist/update/:name/:col/:val', (req, res) => {
    // thoedmuzikdb.all('UPDATE artist SET '+req.params.col+'=\''+req.params.val+'\' WHERE name is \''+req.params.name+'\'', [req.params.songId,req.params.username,req.params.timestamp,req.params.data], (err, rows) => {
    // console.log('UPDATE artist SET '+req.params.col+'=\''+decodeURIComponent(req.params.val)+'\' WHERE name is \''+req.params.name+'\'');
    thoedmuzikdb.all('UPDATE artist SET '+req.params.col+'=\''+decodeURIComponent(req.params.val)+'\' WHERE name is \''+req.params.name+'\'', [], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error Updating an artist data' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Get all the comments for a specified song.
*/
app.get('/api/comments/:songId', (req, res) => {
    thoedmuzikdb.all('SELECT id, username, data, timestamp FROM comment WHERE songId=?', [req.params.songId], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching Song Comments' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Get all the data for a specified artist.
*/
app.get('/api/artist/:name/data', (req, res) => {
    thoedmuzikdb.all('SELECT * FROM artist WHERE name=?', [req.params.name], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching Artist data' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Get the slides for a specified artist.
*/
app.get('/api/artist/:name/slides', (req, res) => {
    thoedmuzikdb.all('SELECT slides_json FROM artist WHERE name=?', [req.params.name], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching Song Contributers' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Insert a song into the music DB.
    Required Params:
        - name
        - youtube_video_id
        - thumbnail
*/
app.post('/api/song/insert', (req, res) => {
    let insertQuery = "";
    console.log(req.body.thumbnail);
    if(req.body.thumbnail !== null)
        insertQuery = `INSERT INTO song(name, youtube_video_id, thumbnail) VALUES('${req.body.name}','${req.body.youtube_video_id}','${req.body.thumbnail}')`;
    else
        insertQuery = `INSERT INTO song(name, youtube_video_id) VALUES('${req.body.name}','${req.body.youtube_video_id}')`;

    console.log(insertQuery);

    muzikdb.run(insertQuery, [], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error Inserting a Song' });
    } else {
        res.send(rows);
    }
    });
});
// app.post('/api/song/:name/:youtube_video_id', (req, res) => {
//     muzikdb.run('INSERT INTO song(name, youtube_video_id) VALUES(?,?)', [req.params.name, req.params.youtube_video_id], (err, rows) => {
//     if (err) {
//         res.status(500).json({ error: 'Error Inserting a Song' });
//     } else {
//         res.send(rows);
//     }
//     });
// });
// app.post('/api/song/:name/:youtube_video_id/:thumbnail', (req, res) => {
//     muzikdb.run('INSERT INTO song(name, youtube_video_id, thumbnail) VALUES(?,?,?)', [req.params.name, req.params.youtube_video_id, req.params.thumbnail], (err, rows) => {
//     if (err) {
//         res.status(500).json({ error: 'Error Inserting a Song' });
//     } else {
//         res.send(rows);
//     }
//     });
// });
// app.post('/api/song/:name/:youtube_video_id/:thumbnail?', (req, res) => {
//     const { name, youtube_video_id, thumbnail } = req.params;
//     const query = thumbnail
//         ? 'INSERT INTO song(name, youtube_video_id, thumbnail) VALUES(?,?,?)'
//         : 'INSERT INTO song(name, youtube_video_id) VALUES(?,?)';
//     const params = thumbnail
//         ? [name, youtube_video_id, thumbnail]
//         : [name, youtube_video_id];

//     muzikdb.run(query, params, (err) => {
//         if (err) {
//             res.status(500).json({ error: 'Error Inserting a Song' });
//         } else {
//             res.status(200).json({ message: 'Song inserted successfully' });
//         }
//     });
// });

/*
    Remove a song's contributer
    Required Params:
        - songId
        - contributer
*/
app.post('/api/song/contributer/remove', (req, res) => {
    muzikdb.run(`DELETE FROM song_contributer WHERE songId=? AND contributer=?`, [req.body.songId, req.body.contributer], (err)=>{
        if(err) {
            res.status(500).json({ error: 'Error Updating a Song\'s contributers' });
        }
    });
});
/*
    Remove a song's link
    Required Params:
        - songId
        - link
*/
app.post('/api/song/link/remove', (req, res) => {
    muzikdb.run(`DELETE FROM song_link WHERE songId=? AND link=?`, [req.body.songId, req.body.link], (err)=>{
        if(err) {
            res.status(500).json({ error: 'Error Updating a Song\'s contributers' });
        }
    });
});
/*
    Update a song column
    Required Params:
        - songId
        - col
        - newVal
*/
app.post('/api/song/update', (req, res) => {
    muzikdb.run(`UPDATE song SET ${req.body.col}=? WHERE songId=?`, [req.body.newVal, req.body.songId], (err)=>{
        if(err) {
            res.status(500).json({ error: 'Error Updating a Song' });
        }
    });
});

/*
    Update a tape column
    Required Params:
        - tapeType
        - tapeId
        - col
        - newVal
*/
app.post('/api/tape/update', (req, res) => {
    let idColName = (req.body.tapeType == "extendedplay")? "epId":req.body.tapeType+"Id";
    muzikdb.run(`UPDATE ${req.body.tapeType} SET ${req.body.col}=? WHERE ${idColName}=?`, [req.body.newVal, req.body.tapeId], (err)=>{
        if(err) {
            res.status(500).json({ error: 'Error Updating a Tape' });
        }
    });
});

/*
    Remove a Tape_Song connection from the db
    Required Params: 
        - tapeType
        - tapeId
        - songId
*/
app.post('/api/tape/song/remove', (req, res) => {
    let idColName = (req.body.tapeType == "extendedplay")? "epId":req.body.tapeType+"Id";
    muzikdb.run("DELETE FROM "+req.body.tapeType+"_song WHERE "+idColName+"=? AND songId=?", [req.body.tapeId, req.body.songId], (err) => {
        if(err) {
            res.status(500).json({ error: 'Error Removing a Tape_Song' });
        }
    });
});

/*
    Remove a Tape from the db
    Required Params: 
        - tapeType
        - tapeId
*/
app.post('/api/tape/remove', (req, res) => {
    let idColName = (req.body.tapeType == "extendedplay")? "epId":req.body.tapeType+"Id";
    let removeTapeQuery = "DELETE FROM "+req.body.tapeType+" WHERE "+idColName+"="+req.body.tapeId;
    let removeTapeSongQuery = "DELETE FROM "+req.body.tapeType+"_song WHERE "+idColName+"="+req.body.tapeId;

    muzikdb.serialize(()=> {
        muzikdb.run('BEGIN TRANSACTION');

        muzikdb.run(removeTapeQuery, [], (err) => {
            if (err) {
                console.error('Error deleting from '+req.body.tapeType+' :', err);
                return muzikdb.run('ROLLBACK', () => {
                    res.status(500).json({ error: 'Error Removing a Tape' });
                });
            }
        });

        muzikdb.run(removeTapeSongQuery, [], (err) => {
            if (err) {
                console.error('Error deleting from '+req.body.tapeType+'_song :', err);
                return muzikdb.run('ROLLBACK', () => {
                    res.status(500).json({ error: 'Error Removing a Tape_Song' });
                });
            }
        });

        muzikdb.run('COMMIT', (err) => {
            if (err) {
                console.error('Error committing transaction:', err);
                return res.status(500).json({ error: 'Transaction Commit Failed' });
            }
            res.status(200).json({ message: 'Song and related data removed successfully' });
        });
    });
});

/*
    Remove a song from the db
    Required Params:
        - songId
*/
app.post('/api/song/remove', (req, res) => {
    const songId = req.body.songId;

    if (!songId) {
        return res.status(400).json({ error: 'songId is required' });
    }

    muzikdb.serialize(() => {
        muzikdb.run('BEGIN TRANSACTION');

        muzikdb.run('DELETE FROM song WHERE songId = ?', [songId], (err) => {
            if (err) {
                console.error('Error deleting from song:', err);
                return muzikdb.run('ROLLBACK', () => {
                    res.status(500).json({ error: 'Error Removing a Song' });
                });
            }
        });

        muzikdb.run('DELETE FROM song_contributer WHERE songId = ?', [songId], (err) => {
            if (err) {
                console.error('Error deleting from song_contributer:', err);
                return muzikdb.run('ROLLBACK', () => {
                    res.status(500).json({ error: 'Error Removing a Song_Contributer' });
                });
            }
        });

        muzikdb.run('DELETE FROM song_link WHERE songId = ?', [songId], (err) => {
            if (err) {
                console.error('Error deleting from song_link:', err);
                return muzikdb.run('ROLLBACK', () => {
                    res.status(500).json({ error: 'Error Removing a Song_Link' });
                });
            }
        });

        muzikdb.run('COMMIT', (err) => {
            if (err) {
                console.error('Error committing transaction:', err);
                return res.status(500).json({ error: 'Transaction Commit Failed' });
            }
            res.status(200).json({ message: 'Song and related data removed successfully' });
        });
    });
});


/*
    Insert a song's contributers into the music DB.
    Required Params:
        - songId
        - contributer
*/
app.post('/api/song/contributer/insert', (req, res) => {
    muzikdb.run('INSERT INTO song_contributer(songId, contributer) VALUES(?,?)', [req.body.songId, req.body.contributer], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error Inserting a Song Contributer' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Insert a song's links into the music DB.
    Required Params:
        - songId
        - link
*/
app.post('/api/song/link/insert', (req, res) => {
    muzikdb.run('INSERT INTO song_link(songId, link) VALUES(?,?)', [req.body.songId, decodeURIComponent(req.body.link)], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error Inserting a Song Link' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Insert a tape into the music DB.
*/
app.post('/api/tape/:type/:name/:thumbnail', (req, res) => {
    muzikdb.run('INSERT INTO '+req.params.type+'(name, thumbnail) VALUES(?,?)', [req.params.name, req.params.thumbnail], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error Inserting a Tape' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Insert a connection between tape and song in the music DB.
*/
app.post('/api/tape/:type/:tapeId/song/:songId', (req, res) => {
    muzikdb.run('INSERT INTO '+req.params.type+'_song VALUES(?,?)', [req.params.tapeId, req.params.songId], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error Connecting a Tape to a Song' });
    } else {
        res.send(rows);
    }
    });
});

/*
  Get tapeId for a specified tape.  
*/
app.get('/api/tape/:type/id/:name/:thumbnail', (req, res) => {
    let idColName = (req.params.type == "extendedplay")? "epId": req.params.type+"Id";
    muzikdb.all('SELECT '+idColName+' FROM '+req.params.type+' WHERE name=? AND thumbnail=? ', [req.params.name, req.params.thumbnail], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching TapeId' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Get all the contributers for a specified song.
*/
app.get('/api/song/:id/contributers', (req, res) => {
    muzikdb.all('SELECT * FROM song_contributer WHERE songId=?', [Number(req.params.id)], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching Song Contributers' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Get all the links for a specified song.
*/
app.get('/api/song/:id/links', (req, res) => {
    muzikdb.all('SELECT * FROM song_link WHERE songId=?', [Number(req.params.id)], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching Song Links' });
    } else {
        res.send(rows);
    }
    });
});

/*
  Get songId for a specified song.  
*/
app.get('/api/song/id/:name/:youtube_video_id', (req, res) => {
    muzikdb.all('SELECT songId FROM song WHERE name=? AND youtube_video_id=?', [req.params.name, req.params.youtube_video_id], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching SongId' });
    } else {
        res.send(rows);
    }
    });
});
app.get('/api/song/id/:name/:youtube_video_id/:thumbnail', (req, res) => {
    muzikdb.all('SELECT songId FROM song WHERE name=? AND youtube_video_id=? AND thumbnail=?', [req.params.name, req.params.youtube_video_id, req.params.thumbnail], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching SongId' });
    } else {
        res.send(rows);
    }
    });
});

/*
  Get all the data for a specified song.  
*/
app.get('/api/song/:id', (req, res) => {
    muzikdb.all('SELECT * FROM song WHERE songId=?', [Number(req.params.id)], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching Song' });
    } else {
        res.send(rows);
    }
    });
});

app.get('/api/singles', (req,res) => {
    muzikdb.all("SELECT s.songId, s.name, s.youtube_video_id, s.thumbnail, GROUP_CONCAT(DISTINCT sc.contributer) AS contributers, GROUP_CONCAT(DISTINCT sl.link) AS links FROM song s JOIN song_contributer sc ON s.songId = sc.songId JOIN song_link sl ON s.songId = sl.songId WHERE NOT EXISTS (SELECT 1 FROM mixtape_song m_s WHERE m_s.songId = s.songId) AND NOT EXISTS (SELECT 1 FROM album_song a_s WHERE a_s.songId = s.songId) AND NOT EXISTS (SELECT 1 FROM extendedplay_song ep_s WHERE ep_s.songId = s.songId) GROUP BY s.songId, s.name, s.youtube_video_id, s.thumbnail;", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching Singles' });
        } else {
            res.send(rows);
        }
    });
});

/*
    Get all the data for a specified tape.
*/
app.get('/api/tape/:tapeType/:id', (req, res) => {
    let idColName = (req.params.tapeType == "extendedplay")? "epId":req.params.tapeType+"Id";
    muzikdb.all('SELECT * FROM '+req.params.tapeType+' WHERE '+idColName+'=?', [Number(req.params.id)], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching Tape' });
        } else {
            res.send(rows);
        }
    });
});

/*
    Get the songs for a specified tape.
*/
app.get('/api/tape/:tapeType/:id/songs', (req, res) => {
    let idColName = (req.params.tapeType == "extendedplay")? "epId":req.params.tapeType+"Id";
    muzikdb.all('SELECT s.songId, s.name, s.youtube_video_id, s.thumbnail FROM '+req.params.tapeType+'_song t, song s WHERE t.'+idColName+'=? AND t.songId=s.songId', [Number(req.params.id)], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching Tape Songs' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Get all of the songs from the song DB.
*/
app.get('/api/songs', (req, res) => {
    muzikdb.all('SELECT * FROM song', [], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching Muzik' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Get all of the Albums from the DB.
*/
app.get('/api/albums', (req, res) => {
    muzikdb.all('SELECT * FROM album', [], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching Albums' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Get all of the Mixtapes from the DB.
*/
app.get('/api/mixtapes', (req, res) => {
    muzikdb.all('SELECT * FROM mixtape', [], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching Mixtapes' });
    } else {
        res.send(rows);
    }
    });
});

/*
    Get all of the Eps from the DB.
*/
app.get('/api/extendedplays', (req, res) => {
    muzikdb.all('SELECT * FROM extendedplay', [], (err, rows) => {
    if (err) {
        res.status(500).json({ error: 'Error fetching EPs' });
    } else {
        res.send(rows);
    }
    });
});

app.get("/", (req, res) => {
    // res.set('Content-Type', 'text/html');
    res.status(200);
    res.send("Welcome to the root URL of Server");
});

app.listen(port, (error) => {
    if(!error) {
        console.log(`Server running on port ${port}`);
    }
    else {
        console.log(`Server running on port ${port}`);
    }
});