import React from 'react'
import bg from '../assets/images/login-background.jpg'
import {Redirect} from 'react-router-dom';
import './styles/css/SignUp.css';
import axios from 'axios';

function SignUp(props) {
    const [clicked, setClicked] = React.useState(false);

    const [info, setInfo] = React.useState({uname:'',gmail:'',password:''});

    function handleClick(){
        if(info.gmail || info.password || info.uname){
            axios.post('http://localhost:8080/newUser',info).then(res => {
                if(res.data === 'added'){
                    setClicked(true);
                }
                else{
                    alert('Check Your Info');
                }
            });
        }
        else{
            alert('All info is mandatory')
        }
    }

    function handleChange(e){
        const name = e.target.name;
        const value = e.target.value;

        setInfo(preInfo => {
            return {...preInfo,[name]:value}
        })
    }

    return (
        <div className='signUp-container'>
            <img src={bg} alt="back"/>
            <div className="signUp-i-container">
                <h4>Sign Up</h4>
                <input type="text" onChange={handleChange} name='uname' placeholder='Name'/>
                <input type="text" onChange={handleChange} name='gmail' placeholder='Gmail Id'/>
                <input type="password" onChange={handleChange} name='password' placeholder='Password'/>
                <div className="controls">  
                    <button id='signUp-btn' onClick={handleClick}>Sign Up</button>
                </div>
            </div>
            {
                clicked ? <Redirect to='/login'/> : null
            }
        </div>
    )
}

export default SignUp
