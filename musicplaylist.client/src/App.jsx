import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

import PlaylistForm from './components/PlaylistForm';
import TrackForm from './components/TrackForm';
import Playlist from './components/Playlist';
import Track from './components/Track';

import './App.css';

function App() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    const addPlaylist = async (playlist) => {
        try {
            const response = await fetch("/api/playlists", {
                method: "POST",
                body: JSON.stringify(playlist),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const data = await response.json();
            setPlaylists([data, ...playlists]);
            toast.success("Playlist created successfully");
        } catch (err) {
            toast.error(`Error: ${err}`);
        }
    }

    const updatePlaylist = async (playlist) => {
        const response = await fetch(`/api/playlists/${playlist.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playlist)
        });

        if (response.ok) {
            setPlaylists(playlists.map(p => p.id === playlist.id ? playlist : p));
            toast.success("Playlist updated successfully");
        } else {
            toast.error('Failed to updated playlist');
        }

    }

    const deletePlaylist = async (id) => {
        const response = await fetch(`/api/playlists/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            setPlaylists(playlists.filter(playlist => playlist.id !== id));
            toast.success("Playlist deleted successfully");
        } else {
            toast.error("Failed to delete playlist");
        }
    }

    const addTrack = async (track) => {
        try {
            const response = await fetch("/api/tracks", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(track)
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            setPlaylists(playlists.map(playlist => {
                if (playlist.id === data.playlistId) {
                    const tracks = playlist.tracks ? [data, ...playlist.tracks] : [data];
                    return { ...playlist, tracks }
                }
                return playlist;
            }));
            toast.success("Track added successfully")
        } catch (err) {
            toast.error(`Error: ${err}`);
        }
    }

    const updateTrack = async (track) => {
        console.log(track);
        const response = await fetch(`/api/tracks/${track.id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(track)
        });

        if (response.ok) {
            setPlaylists(playlists.map(playlist => {
                if (playlist.id === track.playlistId) {
                    return { ...playlist, tracks: playlist.tracks.map(t => t.id === track.id ? track : t) };
                }
                return playlist;
            }));
            toast.success("Track updated successfully");
        } else {
            toast.error("Failed to update track");
        }
    }

    const deleteTrack = async (track) => {
        const response = await fetch(`/api/tracks/${track.id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            setPlaylists(playlists.map(playlist => {
                if (playlist.id == track.playlistId) {
                    return {...playlist, tracks: playlist.tracks.filter(t => t.id !== track.id)}
                }
                return playlist;
            }));

            toast.success("Track deleted successfully");
        } else {
            toast.error("Failed to delete track");
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/playlists");
                if (!response.ok) setError("Loading data failed");
                else {
                    const data = await response.json();
                    setPlaylists(data);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <>
            <Toaster position="top-right" richColors />
            <h1>My playlists</h1>
            <PlaylistForm onAdd={addPlaylist}>
                {({ open }) => <button onClick={open} className="btn btn-primary my-3">New Playlist</button>}
            </PlaylistForm>

            <div className="accordion" id="playlists">
                {playlists.map(playlist => (
                    <Playlist key={playlist.id} playlist={playlist}>
                            <ul className="list-group">
                                {playlist?.tracks?.map(track =>
                                    <Track key={track.id} track={track} playlistId={playlist.id} update={updateTrack} remove={deleteTrack} />
                                )}
                            </ul>
                            <div className="d-flex gap-3 my-3 px-3">
                                <TrackForm onAdd={addTrack} playlistId={playlist.id}>
                                    {({ open }) => <button onClick={open} className="btn btn-primary">Add Track</button>}
                                </TrackForm>
                            <PlaylistForm onAdd={updatePlaylist} playlist={playlist}>
                                    {({ open }) => <button onClick={open} className="btn btn-warning">Edit</button>}
                                </PlaylistForm>
                                <button onClick={() => deletePlaylist(playlist.id)} className="btn btn-danger">
                                    Delete
                                </button>
                            </div>
                    </Playlist>
                ))}
            </div>
        </>
    );
}

export default App;