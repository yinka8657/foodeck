import './App.css';
import signouticon from './signouticon.svg'
import avataricon from './avataricon.svg'
import solidcancel from './x-cancel-solid-icon.svg'
import logo from './logo.svg';



function MenuBar () {


return (

    <div className='MenuBarOverlay'>
        <div className='MenuBarContainer'>
            <div className='MenuContainer'>
                <div className='MenuTopGroup'>
                    <div className='MenuLogo'>
                    <img src={logo} alt="recipeImage" style={{ width: '100%' }} />
                    </div>
                    <div className='CloseBtn'>
                        <img src={solidcancel} alt="close" style={{ width: '100%' }} />
                    </div>
                </div>
                <div className='MenuMiddleGroup'>
                    <div className='Avatar'>
                     <img src={avataricon} alt="" style={{ width: '100%' }} />
                    </div>
                    <span style={{ fontSize: 'large' }}>
                        Olayinka Suberu
                    </span>
                </div>
                <div className='MenuBottomGroup'>
                    <div className='SignOutIcon'>
                        <img src={signouticon} alt="" style={{ width: '100%' }} />
                    </div>
                    <span style={{ fontSize: 'x-large' }}>
                        Sign Out
                    </span>
                </div>
            </div>
        </div>
    </div>
    
)


}


export default MenuBar;