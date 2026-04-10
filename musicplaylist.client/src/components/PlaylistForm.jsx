import { useEffect, useRef, useState } from 'react';

export default function PlaylistForm({ onAdd, playlist, children }) {

    const [title, setTitle] = useState('');

    const dialogRef = useRef();

    // pre-populate form if updating existing playlist
    useEffect(() => {
        setTitle(playlist?.title);
    }, [playlist]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onAdd({...playlist, title });
        setTitle('');
        dialogRef.current.close();
    }

    const openModal = () => dialogRef.current.showModal();

    return (
        <>
            {/* Allow callsite to provide their own button implementation
                for launching the dialog */}
            {children({open: openModal})}
            <dialog ref={dialogRef}>
                <h3>Create playlist</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-control" />
                    </div>
                    <div className="d-flex gap-3 my-3">
                        <button 
                            className="btn btn-success"
                        >Save</button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => dialogRef.current.close()}
                        >Cancel</button>
                    </div>
                </form>
            </dialog>
        </>
    );
}