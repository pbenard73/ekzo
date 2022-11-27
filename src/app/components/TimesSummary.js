import { Accordion, AccordionDetails, AccordionSummary, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";

const TimesSummary = ({results, goHome}) => {
    // Get the processed tables numbers and sort it
    const tables = [...(new Set(Object.values(results).map(i => i.one)))]
    tables.sort()

    // Get human readable total time ellapsed
    const totalTime = Math.floor(Object.values(results).reduce((a, b) =>  (a + b.time), 0)) / 1000
    const totalReadable = `${Math.floor(totalTime / 60)} min ${totalTime % 60} s`

    // Summary table data mapping
    const rowMap = [
        {label: '', render: value => value.value == value.response ? '😃' : '😭'},
        {label: 'Résultat', render: value => value.value},
        {label: 'Réponse', render: value => value.response},
        {label: 'Temps', render: value => Math.floor(value.time) / 1000},
        {label: 'Tentatives', render: value => value.tries},
    ]

    // Get table content for a given one
    const getTableContent = table => {
        // Get the values and sort it by second operation number
        const values = Object.values(results).filter(i => i.one === table)
        values.sort((a, b) => a.two < b.two ? -1 : 1)

        return (
            <Table key={`values-${table}`}>
                <TableHead>
                    <TableCell>Calcul</TableCell>
                    {values.map(value => <TableCell>{`${table} * ${value.two}`}</TableCell>)}
                </TableHead>
                <TableBody>
                    {rowMap.map(item => (
                        <TableRow key={item.label}>
                            <TableCell>{item.label}</TableCell>
                            {values.map(value => (
                                <TableCell>{item.render(value)}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    // Get the little smiley and ellapsed time
    const getHappyness = table => {
        const items = Object.values(results).filter(i => i.one === table)
        const values = items.reduce((a, b) =>  b.value == b.response ? (a + 1) : a, 0)
        const time = Math.floor(items.reduce((a, b) =>  (a + b.time), 0)) / 1000      
   
        const readable = `${Math.floor(time / 60)} min ${time % 60} s`

        if (values === 11) {
            return `${readable} 🥰`
        }
        if (values >= 7) {
            return `${readable} 😃`
        }

        return `${readable} 😭`
    }

    /**
     * Main render
     * 
     * Total Time 
     * Accordion for each table number
     * Go Home bottom button
     */
    return (
        <div style={{padding: '0 20px', overflowX: 'auto'}}>
            <div>Temps total: {totalReadable}</div>
            {tables.map(table => (
                <Accordion key={table}>
                    <AccordionSummary>
                    <p  style={{width:'100%', display:"flex", alignItems: 'center'}}>
                        <b style={{marginRight:'auto'}}>{`Table de ${table} : `}</b>
                        <span>{getHappyness(table)}</span>
                    </p>
                    </AccordionSummary>
                    <AccordionDetails>
                        {getTableContent(table)}
                    </AccordionDetails>
                </Accordion>
            ))}

            <div style={{textAlign:'right', margin: '20px 0'}}>
                <Button variant="contained" color='secondary' onClick={goHome}>
                    Accueil
                </Button>
            </div>
        </div>
    )
}

export default TimesSummary