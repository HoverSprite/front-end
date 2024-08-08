
export const getPersonList = async () => {
    const response = await fetch('http://localhost:8080/persons');
    const data = await response.json();
    console.log(data);
    return data;
}