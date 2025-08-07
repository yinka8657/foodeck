import './App.css';
import hamburger from './hamburger.svg';
import notifybell from './notifybell.svg';
import logo from './logo.svg';
import { useLocation } from 'react-router-dom';



function HeaderBar() {

    const location = useLocation();

    //Hide elements

    const hideHeaderElements = ['/ingredient-to-recipe/suggestions','/ingredient-to-recipe'].includes(location.pathname);
    const hideTitleElement = ['/' , '/ingredient-to-recipe'].includes(location.pathname);
    const hideIngredientTitle = ['/ingredient-to-recipe/suggestions', '/'].includes(location.pathname);
    


  return (
   <div className='HeaderContainer'>
        <div className='HeaderWrap'>
            {
                !hideHeaderElements && (
                    <>
                        <div className='HamburgerIcon'>
                            <img src={hamburger} alt="menu" style={{ width: '10vw' }} />
                        </div>
                        <div className='Logo'>
                            <img src={logo} alt="logo" style={{ width: '30vw' }} />
                        </div>
                    </>
                )
                
            }

            {
                !hideTitleElement &&  (

                    <div className='RecipeSuggestPageTitle'  >
                        <h2>
                            Recipe Suggestion
                        </h2>
                    </div>   
               
                )
            }


            {
                !hideIngredientTitle && (

                    <div className='RecipeSuggestPageTitle'>
                        <h2>
                            Ingredient List
                        </h2>
                    </div>   
               
                )
            }
            
            
            <div className='NotifyBellIcon'>
                <div className='NotifyCountBlack'>
                    <span>2</span>
                </div>
                <img src={notifybell} alt="notification" style={{ width: '10vw' }} />
            </div>
        </div>
   </div>
  );
}

export default HeaderBar;