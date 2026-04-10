import { useEffect, useRef, useState } from 'react';

export default function TrackForm({ onAdd, playlistId, track, children }) {
    const [edit, setEdit] = useState({ title: '', artist: '' });

    const dialogRef = useRef();

    // pre-populate form when update existing track
    useEffect(() => {
        setEdit({ ...edit, ...track });
    }, [track]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onAdd({ ...edit, playlistId });
        setEdit({ title: '', artist: '' });
        
        dialogRef.current.close();
    }

    const openModal = () => dialogRef.current.showModal();


    return (
        <>
            {children({open: openModal})}
            <dialog ref={dialogRef}>
                <h3>{track ? 'Update track' : 'Add track'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            className="form-control"
                            name="title"
                            type="text"
                            value={edit.title}
                            onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="artist" className="form-label">Artist</label>
                        <input
                            className="form-control"
                            name="artist"
                            type="text"
                            value={edit.artist}
                            onChange={(e) => setEdit({...edit, artist: e.target.value })} />
                    </div>
                    <div className="d-flex gap-3 my-3">
                        <button className="btn btn-success">Save</button>
                        <button type="button" className="btn btn-danger" onClick={() => dialogRef.current.close()}>Cancel</button>
                    </div>
                </form>
            </dialog>
        </>
    );
}