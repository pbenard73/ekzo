import React from 'react'
import { PAGES } from '../App'
import Lottie from "lottie-react";
import * as unicorn from './../anim/68980-cute-unicorn-lottie-animation.json'
import { Button, Checkbox, List, ListItem, ListItemIcon, ListItemText, Slider } from '@mui/material';
import { H1 } from '../components/H1';
import styled from 'styled-components';

const ListItemHover = styled(ListItem)`
    cursor: pointer;
    padding: 0 16px !important;
    &:hover{
        backdrop-filter: hue-rotate(300deg);
    }
`


/**
 * Home Page
 * 
 * [
 *  [ Time Table Selector ]
 *  [ Run button when at least one table selected ]
 * ]
 */
const Home = ({timesTables, setTimesTable, setPage, chrono, setChrono}) =>  (
    <>
        <H1>Ekzoo</H1>
        <div style={{display:'flex'}}>
            <div style={{width:'clamp(100px, 60vw, 400px)', padding:'20px', marginRight:'auto'}}>
                <div style={{padding:'20xp', background: 'rgba(242,211,247,.7)', backdropFilter: 'blur(3px)'}}>
                    <div style={{padding: '10px 16px'}}>
                <p>Chrono</p>
                <Slider
                     color='secondary'
                    aria-label="Chrono"
                    value={chrono}
                    onChange={(e, newValue) => setChrono(newValue)}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={5}
                    max={120}
                />
                    </div>
                    <List>
                        {new Array(12).fill(0).map((_,i) => i).map(table => (
                            <ListItemHover key={table} onClick={() => setTimesTable(old => old.indexOf(table) !== -1 ? timesTables.filter(i => i !== table) : [...old, table])}>
                                <ListItemText primary={table} />
                                <ListItemIcon>
                                    <Checkbox checked={timesTables.indexOf(table) !== -1} />
                                </ListItemIcon>
                            </ListItemHover>
                        ))}
                    </List>
                    </div>
            </div>
            <div style={{width:'clamp(100px, 40vw, 300px)', marginRight:'auto', padding: '20px'}}>
                <Lottie animationData={unicorn} loop={true} />
                {timesTables.length > 0 && (
                    <Button 
                        style={{width:'100%', marginTop:'40px'}}
                        variant="contained"
                        color="secondary" 
                        onClick={() => setPage(PAGES.TIMES)}
                    >
                        Jouer
                    </Button>
                )}
            </div>
        </div>
    </>
)


export default Home