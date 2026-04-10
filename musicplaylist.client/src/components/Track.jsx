import TrackForm from './TrackForm';

export default function Track({ track, playlistId, update, remove }) {
    return (
        <li className="list-group-item d-flex justify-content-between">
            <p>{track.title} by {track.artist}</p>
            <div className="hstack gap-3">
                <TrackForm onAdd={update} track={track} playlistId={playlistId}>
                    {({ open }) => <span role="button" onClick={open}>
                        <i className="bi bi-pencil-square text-primary"></i>
                    </span>}
                </TrackForm>
                <span role="button" onClick={() => remove(track)}><i className="bi bi-trash text-danger"></i></span>
            </div>
        </li>
    );
}