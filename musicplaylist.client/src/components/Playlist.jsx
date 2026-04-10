export default function Playlist({ playlist, children }) {
    return (
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target={`#${playlist.id}`}>
                    {playlist.title}
                </button>
            </h2>
            <div id={playlist.id} className="accordion-collapse collapse" data-bs-parent="#playlists">
                {children}
            </div>
        </div>
    );
}