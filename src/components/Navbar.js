import '../styles/Navbar.css'

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand ms-3" href="#">Weather</a>

            <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul class="navbar-nav mr-auto mt-2 mt-md-0">
            <li class="nav-item active">
            <a class="nav-link active" href="/">Home</a>
            </li>
            <li class="nav-item">
            <a class="nav-link " href="/search">Search</a>
      </li>
    </ul>
  </div>
        </nav>
        
  );
};

  
  export default Navbar;
  