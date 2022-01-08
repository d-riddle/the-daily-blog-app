import './header.css'

function Header(){
    return (
        <div className="header">
            <div className="headerTitles">
                <span className="headerTitleFirst">All the Blogs That's Fit to Read</span>
                <span className="headerTitleSecond">The Daily Blog</span>
            </div>
            <img className="headerImg" src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt=""/>
        </div>
    );
}

export default Header;