import './header.css'

function Header(){
    return (
        <div className="header">
            <div className="headerTitles">
                <span className="headerTitleFirst">React & Node</span>
                <span className="headerTitleSecond">Blog</span>
            </div>
            <img className="headerImg" src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1974&q=80" alt=""/>
        </div>
    );
}

export default Header;