import React, {createContext, useContext, useReducer} from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import AddSong from "./components/AddSong";
import {Grid} from "@mui/material";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import QueuedSongList from "./components/QueuedSongList";
import useMediaQuery from "@mui/material/useMediaQuery";
import reducer from "./shared/reducer";
import {useQuery} from "@apollo/client";
import {GET_QUEUED_SONGS} from "./graphql/queries";

export const SongContext = createContext( {
    song: {
        "artist": "DavZ",
        "duration": 2,
        "id": "437c41a3-c333-441a-8839-527b91f1455d",
        "thumbnail": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOVP.CFJS1g7eB09grBp4J1aGVQHgFo%26pid%3DApi&f=1",
        "title": "Mindless",
        "url": "https://www.youtube.com/watch?v=nwozXqASL7I"
    },
    isPlaying: false
});

function App() {
    const initialSongState = useContext(SongContext)
    const [state, dispatch] = useReducer(reducer, initialSongState);
    const {data} = useQuery(GET_QUEUED_SONGS)

const greaterThan = useMediaQuery(theme => theme.breakpoints.up('md'))
  return (
      <SongContext.Provider value={{state, dispatch}}>
          <Header/>
          <Grid container spacing={3}>
            <Grid
                item
                sm={12}
                md={7}
                style={{
                    paddingTop: "3.5rem"
                }}
            >
                <AddSong/>
                <SongList/>
            </Grid>
              <Grid
                  item
                  sm={12}
                  md={5}
                  style={ greaterThan ? {
                      position: "fixed",
                      top: 70,
                      right: 0,
                      width: '100%'
                  } :
                      {
                          position: "fixed",
                          bottom: 0,
                          left: 0,
                          width: '100%'
                      }
              }
              >
                  <SongPlayer/>
                  <QueuedSongList data={data}/>
              </Grid>

          </Grid>
          <Main/>
      </SongContext.Provider>
  );
}

export default App;
