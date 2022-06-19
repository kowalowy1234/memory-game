import React, { useContext, useEffect, useState } from 'react';
import './Card.css';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Game } from '../../App';
import cn from 'classnames';

interface CardProps {
  card: {
    key?: number
    id: number
    imageSrc: string
    setGame: React.Dispatch<React.SetStateAction<Game>>
    game: Game  
    amount: number  
    category: string
  }
}

export const Card: React.FC<CardProps["card"]> = ({id, imageSrc, game, setGame, amount, category}) => {
 
  const [isFlipped, setIsFlipped] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  
  const flip = () : void => {
    if(!disabled && !game.disableAll){
      setIsFlipped(prev => !prev);
      setGame({
        ...game,
        selected: [...game.selected, id],
        score: game.score + 1
      }); 
      setDisabled(true);     
    }
  }

  useEffect(() : void => {
    setIsFlipped(true);
  }, [amount, category]);

  useEffect(() : void => {
    if(!game.eliminated.includes(id)) {
      !game.disableAll ? setDisabled(false) : setDisabled(true);
    }
  }, [game.disableAll]);

  useEffect(() : void => {
    if(!game.eliminated.includes(id) && game.selected.length === 0) {
      setIsFlipped(true);
      setDisabled(false);
    }
  }, [game.selected]);

  return (
    <div className={cn('Card')} onClick={flip}>
      <div className={!isFlipped ? "showBack" : ""}>
        <div className={cn('front')}>
          <img src={imageSrc} alt=''/>
        </div>
        <div className={cn('back')}><QuestionMarkIcon style={{fontSize: 'inherit'}}/></div>
      </div>
    </div>
  );
}