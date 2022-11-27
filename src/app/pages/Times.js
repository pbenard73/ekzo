import React, { useEffect, useRef, useState } from 'react'
import { Button,  IconButton, LinearProgress, Paper, TextField } from '@mui/material';
import { H1 } from '../components/H1';
import TimesSummary from '../components/TimesSummary';
import { PAGES } from '../App';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import styled from 'styled-components';

const StyledInput = styled(TextField)`
    input{
        padding: 5px;
        font-size: 45px;
        width: 100px;
        text-align:center;
    }
`

/**
 * Generate an empty result object
 */
const makeResult = (tables) => {
    let data = {}

    tables.forEach(table => {
        for (var i = 0; i< 11; i++) {
            data[`${table}-${i}`] = {
                one: table,
                two: i,
                value: i * table,
                exec: false, 
                response: null, 
                id:`${table}-${i}`,
                time: null,
                tries: 0
            }
        }
    })

    return data;
}

/**
 * Main Component
 * Times Page
 */
const Times = ({timesTables, setTimesTable, setPage, chrono}) => {
    // Input ref to set the focus
    const ref = useRef();

    // Results object to store data and generate summary
    const [results, setResults] = useState(makeResult(timesTables))

    // Actual id (results key or id)
    const [actual, setActual] = useState(null)

    // Date time of actual item
    const [time, setTime] = useState(0);

    // Input field value
    const [value, setValue] = useState('');

    // Playing state : true or date time when button was clicked
    const [playing, setPlaying] = useState(true)

    // End of game, trigger to show the summary
    const [isEnd, setIsEnd] = useState(false);

    // Countdown state
    const [countdown, setCountdown] = useState(null)

    /**
     * Find a new random actual id
     */
    const getNewActual = (implementTries = true) => {
        // Get the actual result, in async in order to avoid collision during update
        setResults(oldResults => {
            let newResults = oldResults;

            // Get the availables id 
            let available = [...Object.values(oldResults)].filter(i => i.exec === false)
            
            // If more than 1 available, remove the current id
            if (available.length > 1) {
                available = available.filter(i => i.id !== actual)
            };

            // If no more available then it's end
            if (available.length === 0) {
                setIsEnd(true)
                return newResults
            }
    
            // If there is an actual, so update the number of tries and update time
            if (actual && implementTries) {
                newResults = {
                    ...newResults,
                    [actual]: {
                        ...newResults[actual],
                        time: (newResults[actual].time || 0)      +   ((new Date()).getTime() - time),
                        tries: newResults[actual].tries + 1
                    }   
                }
            }
    
            // Find a new random index
            const randomIndex = Math.floor(Math.random() * 10000 % available.length) 
            setActual(available[randomIndex].id)

            // Result every counts
            setValue('');
            setTime((new Date()).getTime())
            setCountdown(() => chrono)

            return newResults
        })

    }

    /**
     * Each time actual index is updated, set the focus on input, and reset countdown
     */
    useEffect(() => {
        ref.current?.querySelector('input')?.focus?.();
        setCountdown(() => chrono)
    }, [actual])

    /**
     * Each time playing is setting on true, generate new actual id
     */
    useEffect(() => {
        if (playing === true) {
            getNewActual()
        }
    }, [playing])

    /**
     * Each time coundown is updated and bellow Zero, generate a new actual id 
     */
    useEffect(() => {
        if (countdown <= 0 && !isEnd) {
            getNewActual()
        } 
    }, [countdown])

    /**
     * At Component mount, generate an interval at second to decrease countdown
     * At unmount, clear the interval
     */
    useEffect(() => {
        const inter = setInterval(() => {
            setPlaying(isPlaying => {
                if (isPlaying === true) {
                    setCountdown(old => {
                        if (old === null) {
                            return null
                        }
                        
                        return old - 1
                    })
                }
                return isPlaying
            })
        }, 1000)

        return () => clearInterval(inter)
    }, [])

    // Go Home method
    const goHome = () => setPage(PAGES.HOME)

    // Valid input field results
    const validResult = (e) => {
        e.preventDefault()

        if (value.trim() ==='' || !playing) {
            return;
        }

        // Update the actual result with response
        setResults(oldResult => {
            const nowActual = actual;
            const newResult =  {
                ...oldResult,
                [nowActual]: {
                    ...oldResult[nowActual],
                    response: value,
                    exec: true,
                    time: (oldResult[nowActual].time || 0) + ((new Date()).getTime() - time),
                    tries: oldResult[nowActual].tries + 1
                }
            }
            getNewActual(false)

            return newResult
        })
    }

    // Toggle Pause Method
    const togglePause = () => {
        // If want to pause, store the actual time 
        if (playing === true) {
            return setPlaying((new Date()).getTime() - time)
        }

        // When passing to playing, increase the item time and tries
        setResults(oldResult => {
            const nowActual = actual;
            const newResult =  {
                ...oldResult,
                [nowActual]: {
                    ...oldResult[nowActual],
                    time: (oldResult[nowActual].time || 0) + playing,
                    tries: oldResult[nowActual].tries + 1
                }
            }

            setPlaying(() => true)
            return newResult
        })
    }

    /**
     * Main Render
     * 
     * Header
     *  [PlayButton if not ended]
     *  Home Button
     * 
     * [Summary if ended]
     * [
     *      Progress countdown bar
     *      Actual Item render
     *      if not ended
     * ]
     */
    return (
        <>
            <H1>
                Multiplication
                {!isEnd && (
                    <IconButton onClick={togglePause} style={{marginLeft:'50px'}}>
                        {playing === true ? <PauseCircleIcon style={{fontSize:'40px'}}/> : <PlayCircleIcon style={{fontSize:'40px'}}/> }
                    </IconButton>
                )}
                <span style={{marginLeft:'auto'}}>
                     <Button variant="contained" color='secondary' onClick={goHome}>
                        Accueil
                    </Button>
                </span>
            </H1>

            {isEnd && <TimesSummary results={results} goHome={goHome}/>}
            {!isEnd && actual && (
                <>
                <LinearProgress
                    variant="determinate" 
                    value={ countdown * 100 / chrono    } 
                    color="secondary" 
                    style={{ width:' clamp(300px, 75vw, 600px)', margin: '0 auto'}}
                />
                <Paper style={{display:'flex', alignItems: 'center', justifyContent:'center', width:' clamp(300px, 75vw, 600px)', margin: '0 auto'}}>               
                    <p style={{fontSize:'40px', marginRight:'25px'}}>
                        {results[actual].one} * {results[actual].two} =
                    </p>

                    <form onSubmit={validResult}>
                        <StyledInput ref={ref} type="number" required value={value} onChange={e => setValue(e.target.value)} />

                        <Button style={{marginLeft: '20px'}} type='submit' variant="contained" color="secondary">Valider</Button>
                    </form>
                </Paper>
                </>
            )}
        </>

    )

}

export default Times