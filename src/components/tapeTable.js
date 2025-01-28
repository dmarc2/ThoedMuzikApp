import React, { useState, useEffect } from 'react';

function TapeTable({ tapes }) {
    const [tapes, setNeededTapes] = useState([]);

    useEffect(() => {
        // async function fetchTapes() {
        //     // let filteredTapes = tapes.filter(tape => tape.getType() === type);
        //     // setNeededTapes(filteredTapes);
        //     setNeededTapes(tapes);
        // }
        // fetchTapes();
    }, [type, tapes]);

    const handleTapeTableClick = (index) => {
        console.log(`Clicked ${neededTapes[index].getName()}`);
    };

    const capitalizeWord = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Thumbnail</th>
                    <th>Songs Count</th>
                </tr>
            </thead>
            <tbody>
                {tapes.map((tape, index) => (
                    <tr key={index} onClick={() => handleTapeTableClick(index)}>
                        <td>{capitalizeWord(tape.getType())}</td>
                        <td>{tape.getName()}</td>
                        <td>{tape.getThumbnail()}</td>
                        <td>{tape.getSongsCount()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TapeTable;