import './App.css';
import backbutton from './backblackcirclebutton.svg';
import whiteplussign from './plus-sign-white.svg';
import blackplussign from './plus-sign-black.svg';
import xcancelsign from './x-cancel-sign-black.svg';
import { useRef } from 'react';



function AddRecipe() {

    const textareaRef =useRef(null);

    const handletextareaInput = () => {
        const txtarea = textareaRef.current;
        txtarea.style.height = 'auto'; //Resets the default height.
        txtarea.style.height = txtarea.scrollHeight + 'px';
    };

  return (
    <div className="Recipehome">
        <div className='Top-bar-group'>
            <img src={backbutton} alt="back" style={{ width: '10vw' }} />
            <h2>Add New Recipe</h2>
        </div>
        <div className='RecipeListContainer AddRecipeForm'>
            <form action='/upload' method='post' className='Formcontainer'>
                <div className='RecipeImageInputContainer'>
                    <label for='file-upload' className = 'custom-file-upload'>
                        <img src={blackplussign} alt="addfile" style={{ width: '10vw' }} />
                    </label>
                    <input id='file-upload' type="file" name='recipeimage' accept='image/*' style={{ display: 'none' }} ></input>
                </div>
                <div className='RecipeNameInputContainer'>
                    <input type="text" placeholder='Recipe Name' ></input>
                </div>
                <div className='IngredientInputContainer'>
                    <p className='SelectIngredientText'>Select Ingredient:</p>
                    <div className='SelectedIngredientsContainer'>

                        <div className='SelectedIngredient'>
                            <span className='IngredientText'>Rice</span>
                            <div className='RemoveIngredientIcon'>
                                <img src={xcancelsign} alt="back" style={{ width: '4vw' }} />
                            </div>
                        </div>
                        <div className='SelectedIngredient'>
                            <span className='IngredientText'>Beans</span>
                            <div className='RemoveIngredientIcon'>
                                <img src={xcancelsign} alt="back" style={{ width: '4vw' }} />
                            </div>
                        </div>
                        <div className='SelectedIngredient'>
                            <span className='IngredientText'>Plantain</span>
                            <div className='RemoveIngredientIcon'>
                                <img src={xcancelsign} alt="back" style={{ width: '4vw' }} />
                            </div>
                        </div>
                        <div className='SelectedIngredient'>
                            <span className='IngredientText'>Perewinkle</span>
                            <div className='RemoveIngredientIcon'>
                                <img src={xcancelsign} alt="back" style={{ width: '4vw' }} />
                            </div>
                        </div>
                        <div className='SelectedIngredient'>
                            <span className='IngredientText'>Pumpkin Leaves</span>
                            <div className='RemoveIngredientIcon'>
                                <img src={xcancelsign} alt="back" style={{ width: '4vw' }} />
                            </div>
                        </div>
                        <div className='SelectedIngredient'>
                            <span className='IngredientText'>Yam</span>
                            <div className='RemoveIngredientIcon'>
                                <img src={xcancelsign} alt="back" style={{ width: '4vw' }} />
                            </div>
                        </div>
                        <div className='SelectedIngredient'>
                            <span className='IngredientText'>Potato</span>
                            <div className='RemoveIngredientIcon'>
                                <img src={xcancelsign} alt="back" style={{ width: '4vw' }} />
                            </div>
                        </div>
                        <div className='SelectedIngredient'>
                            <span className='IngredientText'>Beef</span>
                            <div className='RemoveIngredientIcon'>
                                <img src={xcancelsign} alt="back" style={{ width: '4vw' }} />
                            </div>
                        </div>

                    </div>
                    <div className='AddIngredientButton'>
                        <img src={whiteplussign} alt="back" style={{ width: '10vw' }} />
                    </div>
                </div>
                <div className='InstructionInputContainer'>
                    <p className='SelectIngredientText'>Add Instructions:</p>
                    <textarea className='InstructionTextInput' ref={textareaRef} onInput={handletextareaInput} defaultValue="Type here is...." />
                </div>
                <div className='SaveRecipeBtnContainer'>
                    <submit>Save Recipe</submit>
                </div>
            </form>
        </div>
    
    </div>
  );
}

export default AddRecipe;