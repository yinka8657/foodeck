import './App.css';
import backbutton from './backblackcirclebutton.svg';
import blackplussign from './plus-sign-black.svg';

import { useRef } from 'react';



function AddRecipe() {

    const textareaRef =useRef(null);

    const handletextareaInput = () => {
        const txtarea = textareaRef.current;
        txtarea.style.height = 'auto'; //Resets the default height.
        txtarea.style.height = txtarea.scrollHeight + 'px';
    };

  return (
    <div className="">
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
                    <input type="text" placeholder='Ingredient Name' ></input>
                </div>
                <div className='InstructionInputContainer'>
                    <p className='SelectIngredientText'>Add Nutritional Info:</p>
                    <textarea className='InstructionTextInput' ref={textareaRef} onInput={handletextareaInput} defaultValue="Type here..." />
                </div>
                <div className='SaveRecipeBtnContainer'>
                    <submit>Save Ingredient</submit>
                </div>
            </form>
        </div>
    
    </div>
  );
}

export default AddRecipe;