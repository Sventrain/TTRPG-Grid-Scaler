import "./layout.css";

export default function Layout({ children }) {
    return (
        <div className="app-container">
            <header className="header">
                <h1 className="title-main">TTRPG</h1>
                <h2 className="title-sub">Grid Scaler</h2>
                <h3 className="title-tag">Upload map to add scaling</h3>
            </header>
            <div className="content">
                <aside className="sidebar">
                    <h3>MENU</h3>
                    <ul>
                        <li>Upload</li>
                            
                        <li>Save</li>
                        <li>Option 1</li>
                        <li>...</li>
                    </ul>
                </aside>
                <main className="main-area">{children}</main>
            </div>
        </div>
    );
}