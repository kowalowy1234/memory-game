import { useEffect, useState } from 'react';
import instance from './axios';
import { Card } from './Components/Card/Card';
import { Header } from './Components/Header/Header';
import { placeholderData } from './placeholderData';
import './App.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Button } from '@mui/material';
import { RefreshOutlined } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export interface State {
  Cards : {
    id : number;
    url: string
  }
}

export interface Game {
  selected: number[]
  disableAll: boolean
  score: number
  left: number
  eliminated: number []
}

const App : React.FC = () => {

  const defaultContext : Game = {
    selected: [],
    disableAll: false,
    score: 0,
    left: 4,
    eliminated: []
  } 

  const uuid = require('react-uuid')

  const [cards, setCards] = useState<State["Cards"][]>(placeholderData);
  const [cardAmount, setCardAmount] = useState<number>(4);
  const [category, setCategory] = useState<string>('car');
  const [game, setGame] = useState<Game>(defaultContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() : void => {
    setLoading(true);
    setError(false);
    instance.get(`search?query=${category}&orientation=square&per_page=${cardAmount}`)
    .then(response => {
      const mappedData : State["Cards"][] = response.data.photos.map((e : any) => ({
        id : e.id,
        url : e.src.original,
      }))
      restartGame();
      setCards(mappedData.concat(mappedData).sort(() => 0.5 - Math.random()));
      setLoading(false);
    })
    .catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [category, cardAmount]);

  const cardElements : JSX.Element[]  = cards.map(e => <Card id={e.id} imageSrc={e.url} game={game} setGame={setGame} amount={cardAmount} category={category}/>);

  const restartGame = () : void => {
    setGame({
      ...defaultContext,
      left: cardAmount
    });
  }

  useEffect(() : void => {
    if(game.selected.length === 2 && (game.selected[0] !== game.selected[1])) {
      //Bad
      setGame(prevGame => ({
        ...prevGame,
        disableAll: true,
      }));
      const delay = setTimeout(() : void => {
        setGame(prevGame => ({
          ...prevGame,
          disableAll: false,
          selected: []
        }))
      }, 1000);
    } else if (game.selected.length === 2 && (game.selected[0] === game.selected[1])) {
      //Good
      const id = game.selected[0];
      setGame(prevGame => ({
        ...prevGame,
        eliminated: [...prevGame.eliminated, id],
        selected: [],
        left: prevGame.left - 1,
        disableAll: false
      }))
    }
      
  }, [game.selected]);

  const handleClose = () => {
    setLoading(true);
    setOpen(false);
    setCards(prevCards => prevCards.sort(() => 0.5 - Math.random()));
    restartGame();
    const delay = setTimeout(() : void => {
      setLoading(false);
    }, 200);
  };

  useEffect(() : void => {
    if(game.left === 0 ) {
      setOpen(true);
    }
  }, [game.left]);

  const dialog : JSX.Element = <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title" style={{fontFamily: "'Staatliches', cursive"}}>
      {"Congratulations, you win!"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        <span style={{fontFamily: "'Staatliches', cursive", display: 'block'}}>Your final score: {Math.ceil(game.score / 2)}</span>
        <span style={{fontFamily: "'Staatliches', cursive", display: 'block'}}>Card set: {cardAmount}</span>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' color='primary' style={{fontFamily: "'Staatliches', cursive"}} onClick={handleClose}>Start again!</Button>
    </DialogActions>
  </Dialog>

  return (
      <div className="App">
        {dialog}
        <div className='App__game'>
          <div className='App__game__cards'>
            <Header />
            <div className='App__game__score'>
              <p>Attempts: {Math.ceil(game.score / 2)}</p>
              <p>Pairs left: {game.left}</p>
            </div>
            {!error && !loading && cardElements}
            {error && <Alert severity="error">Something went wrong while loading photos, sorry!</Alert>}
            {loading && <CircularProgress />}
          </div>
          <div className='App__game__settings'>
            <FormControl>
              <InputLabel id="card-amount">Card amount</InputLabel>
              <Select
                style={{width: '20ch'}}
                labelId="card-amount"
                label='card-amount'
                id="card-amount"
                value={cardAmount}
                onChange={(e) => {
                  setCardAmount(Number(e.target.value));
                  setGame({
                    ...defaultContext,
                    left: Number(e.target.value)
                  });
                }}
              >
                <MenuItem value={4}>8</MenuItem>
                <MenuItem value={5}>10</MenuItem>
                <MenuItem value={6}>12</MenuItem>
                <MenuItem value={7}>14</MenuItem>
                <MenuItem value={8}>16</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                style={{width: '20ch'}}
                labelId="demo-simple-select-label"
                label='Category'
                id="demo-simple-select"
                value={category}
                onChange={(e) => {setCategory(e.target.value)}}
              >
                <MenuItem value='car'>Cars</MenuItem>
                <MenuItem value='dog'>Dogs</MenuItem>
                <MenuItem value='cat'>Cats</MenuItem>
                <MenuItem value='bird'>Birds</MenuItem>
                <MenuItem value='nature'>Nature</MenuItem>
                <MenuItem value='people'>People</MenuItem>
              </Select>
            </FormControl>
            <Button color='success' endIcon={<RefreshOutlined />} onClick={restartGame}>Restart</Button>
          </div>
        </div>
      </div>
  );
}

export default App;


