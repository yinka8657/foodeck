import './App.css';
import blackbell from './notifybellblack.svg'
import backarrow from './backarrowblack.svg'
import solidcancel from './x-cancel-solid-icon.svg'
import redcancel from './red-x-icon.svg'
import greencheck from './green-check-icon.svg'



function Notification () {


return (

    <div className='NotificationPane'>
        <div className='NotificationDisplayWrap'>
            <div className='NotifyTopGroup'>
                <div className='BackArrowContainer'>
                    <img src={backarrow} alt="back" style={{ width: '10vw' }} />
                </div>
                <div className='BlackBellContainer'>
                    <div className='NotifyCountBlack'>
                        <span>2</span>
                    </div>
                    <img src={blackbell} alt="back" style={{ width: '10vw' }} />
                </div>
            </div>
            <div className='NotificationDisplay'>
                <div className='NotificationItem'>
                    <div className='NotifyTextContainer'>
                        <div className='TextTopGroup'>
                           <div className='SignContainer'>
                             <img src={redcancel} alt="" style={{ width: '6vw' }} />      
                           </div>
                           <span style={{ fontSize: 'large' }}><strong>Expired Ingredient</strong></span>
                        </div>
                        <div className='TextBottomGroup'>
                            <span style={{ fontSize: 'large' }}> <span>Tomato</span> - 2/05/2029</span>
                        </div>
                    </div>
                    <div className='SolidCancelContainer'>
                        <img src={solidcancel} alt="back" style={{ width: '6vw' }} />
                    </div>
                </div>
                <div className='NotificationItem'>
                    <div className='NotifyTextContainer'>
                        <div className='TextTopGroup'>
                           <div className='SignContainer'>
                             <img src={greencheck} alt="" style={{ width: '6vw' }} />      
                           </div>
                           <span style={{ fontSize: 'large' }}><strong>New Ingredient</strong></span>
                        </div>
                        <div className='TextBottomGroup'>
                            <span style={{ fontSize: 'large' }}> <span>Tomato</span> - 2/05/2029</span>
                        </div>
                    </div>
                    <div className='SolidCancelContainer'>
                        <img src={solidcancel} alt="back" style={{ width: '6vw' }} />
                    </div>
                </div>
                <div className='NotificationItem'>
                    <div className='NotifyTextContainer'>
                        <div className='TextTopGroup'>
                           <div className='SignContainer'>
                             <img src={redcancel} alt="" style={{ width: '6vw' }} />      
                           </div>
                           <span style={{ fontSize: 'large' }}><strong>Expired Ingredient</strong></span>
                        </div>
                        <div className='TextBottomGroup'>
                            <span style={{ fontSize: 'large' }}> <span>Tomato</span> - 2/05/2029</span>
                        </div>
                    </div>
                    <div className='SolidCancelContainer'>
                        <img src={solidcancel} alt="back" style={{ width: '6vw' }} />
                    </div>
                </div>
                <div className='NotificationItem'>
                    <div className='NotifyTextContainer'>
                        <div className='TextTopGroup'>
                           <div className='SignContainer'>
                             <img src={redcancel} alt="" style={{ width: '6vw' }} />      
                           </div>
                           <span style={{ fontSize: 'large' }}><strong>Expired Ingredient</strong></span>
                        </div>
                        <div className='TextBottomGroup'>
                            <span style={{ fontSize: 'large' }}> <span>Tomato</span> - 2/05/2029</span>
                        </div>
                    </div>
                    <div className='SolidCancelContainer'>
                        <img src={solidcancel} alt="back" style={{ width: '6vw' }} />
                    </div>
                </div>
                <div className='NotificationItem'>
                    <div className='NotifyTextContainer'>
                        <div className='TextTopGroup'>
                           <div className='SignContainer'>
                             <img src={redcancel} alt="" style={{ width: '6vw' }} />      
                           </div>
                           <span style={{ fontSize: 'large' }}><strong>Expired Ingredient</strong></span>
                        </div>
                        <div className='TextBottomGroup'>
                            <span style={{ fontSize: 'large' }}> <span>Tomato</span> - 2/05/2029</span>
                        </div>
                    </div>
                    <div className='SolidCancelContainer'>
                        <img src={solidcancel} alt="back" style={{ width: '6vw' }} />
                    </div>
                </div>
                <div className='NotificationItem'>
                    <div className='NotifyTextContainer'>
                        <div className='TextTopGroup'>
                           <div className='SignContainer'>
                             <img src={redcancel} alt="" style={{ width: '6vw' }} />      
                           </div>
                           <span style={{ fontSize: 'large' }}><strong>Expired Ingredient</strong></span>
                        </div>
                        <div className='TextBottomGroup'>
                            <span style={{ fontSize: 'large' }}> <span>Tomato</span> - 2/05/2029</span>
                        </div>
                    </div>
                    <div className='SolidCancelContainer'>
                        <img src={solidcancel} alt="back" style={{ width: '6vw' }} />
                    </div>
                </div>
                <div className='NotificationItem'>
                    <div className='NotifyTextContainer'>
                        <div className='TextTopGroup'>
                           <div className='SignContainer'>
                             <img src={redcancel} alt="" style={{ width: '6vw' }} />      
                           </div>
                           <span style={{ fontSize: 'large' }}><strong>Expired Ingredient</strong></span>
                        </div>
                        <div className='TextBottomGroup'>
                            <span style={{ fontSize: 'large' }}> <span>Tomato</span> - 2/05/2029</span>
                        </div>
                    </div>
                    <div className='SolidCancelContainer'>
                        <img src={solidcancel} alt="back" style={{ width: '6vw' }} />
                    </div>
                </div>
                <div className='NotificationItem'>
                    <div className='NotifyTextContainer'>
                        <div className='TextTopGroup'>
                           <div className='SignContainer'>
                             <img src={redcancel} alt="" style={{ width: '6vw' }} />      
                           </div>
                           <span style={{ fontSize: 'large' }}><strong>Expired Ingredient</strong></span>
                        </div>
                        <div className='TextBottomGroup'>
                            <span style={{ fontSize: 'large' }}> <span>Tomato</span> - 2/05/2029</span>
                        </div>
                    </div>
                    <div className='SolidCancelContainer'>
                        <img src={solidcancel} alt="back" style={{ width: '6vw' }} />
                    </div>
                </div>
                <div className='NotificationItem'>
                    <div className='NotifyTextContainer'>
                        <div className='TextTopGroup'>
                           <div className='SignContainer'>
                             <img src={redcancel} alt="" style={{ width: '6vw' }} />      
                           </div>
                           <span style={{ fontSize: 'large' }}><strong>Expired Ingredient</strong></span>
                        </div>
                        <div className='TextBottomGroup'>
                            <span style={{ fontSize: 'large' }}> <span>Tomato</span> - 2/05/2029</span>
                        </div>
                    </div>
                    <div className='SolidCancelContainer'>
                        <img src={solidcancel} alt="back" style={{ width: '6vw' }} />
                    </div>
                </div> 
            </div>
        </div>
    </div>
)


}


export default Notification;