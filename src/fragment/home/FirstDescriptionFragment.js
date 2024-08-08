import './FirstDescriptionFragment.css';
import { getPersonList } from './../../service/DataService';
import { useEffect, useState } from 'react';

function FirstDescriptionFragment() {
    const [persons, setPersons] = useState([]);

    useEffect(() => {
        getPersonList().then(data => {
            setPersons(data);
        }).catch(error => {
            console.error("Error fetching persons:", error);
        });
    }, []);
    return (
        <div className="description-container">
            <div id="persons">
                {persons.map((person, index) => (
                    <div key={index}>{person.name}</div>
                ))}
            </div>
        </div>
    )
}

export default FirstDescriptionFragment