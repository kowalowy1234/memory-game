import React from 'react';
import './Header.css';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';

interface HeaderProps {

}

export const Header: React.FC<HeaderProps> = ({}) => {
    return (
      <div className='Header'>
        <PsychologyRoundedIcon style={{fontSize: '68px'}}/> 
        <span>Memory Game</span>
      </div>
    );
}